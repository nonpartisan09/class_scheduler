import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import { FormattedMessage } from 'react-intl';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import { postData } from './utils/sendData';
import SnackBarComponent from './reusable/SnackBarComponent';

import './AvailabilitiesTable.css';
import formatLink from './utils/Link';

class AvailabilitiesTable extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleHideSnackBar = this.handleHideSnackBar.bind(this);

    this.state = {
      showSnackBar: false,
      message: ''
    };
  }

  render() {
    const { availabilities, timezone } = this.props;

    const tableContent =  _.map(availabilities, ({ day, start_time, end_time, id }) => {
      return(
        <TableRow className='availabilitiesTableRow' key={ 'body' + day + start_time + end_time }>
          <TableRowColumn>
            { day }
          </TableRowColumn>
          <TableRowColumn>
            { start_time }
          </TableRowColumn>
          <TableRowColumn>
            { end_time }
          </TableRowColumn>
          { this.renderDeleteRow(id) }
        </TableRow>
      );
    });

    const listContent =  _.map(availabilities, ({ day, start_time, end_time, id }) => {
      return(
        <div key={ 'list' + day + start_time + end_time + timezone } className='availabilityTableItemContainer'>
          <li>
            <span>
              <FormattedMessage
                id='Availabilities.listDay'
                defaultMessage='Day'
              />: { day }
            </span>
          </li>

          <li>
            <span>
              <FormattedMessage
                id='Availabilities.from'
                defaultMessage='From'
              />: { start_time }
            </span>
          </li>
          <li>
            <span>
              <FormattedMessage
                id='Availabilities.to'
                defaultMessage='To'
              />: { end_time }
            </span>
          </li>

          <li>
            <span>
              <FormattedMessage
                id='Availabilities.timezone'
                defaultMessage='Timezone'
              />: { timezone }
            </span>
          </li>

          { this.renderDeleteListContent(id) }

         <div className='smallScreenAvailabilityTableDivider'>
           <Divider />
         </div>
        </div>
      );
    });


    return (
      <div>
        <div className='tableHideSmallScreen'>
          <Table selectable={ false } >
            <TableHeader displaySelectAll={ false }>
              <TableRow>
                <TableHeaderColumn key='day' >
                  <FormattedMessage
                    id='Availabilities.day'
                    defaultMessage='Day'
                  />
                </TableHeaderColumn>
                <TableHeaderColumn key='start_time'>
                  <FormattedMessage
                    id='startTime'
                    defaultMessage='Start Time'
                  />
                </TableHeaderColumn>
                <TableHeaderColumn key='end_time'>
                  <FormattedMessage
                    id='endTime'
                    defaultMessage='End Time'
                  />
                </TableHeaderColumn>
                { this.renderDeleteColumn() }
              </TableRow>
            </TableHeader>

            <TableBody displayRowCheckbox={ false }>
              { tableContent }
            </TableBody>
          </Table>
          { this.renderSnackBar() }
        </div>

        <div className='tableHideMediumScreen'>
          { listContent }
        </div>
      </div>
    );
  }

  renderDeleteListContent(id) {
    if (this.props.deletable) {
      return (
        <li className='availabilitiesTableButton'>
          <RaisedButton
            primary
            fullWidth
            onClick={ this.handleDelete(id) }
            label={
              <FormattedMessage
                id='Delete'
                defaultMessage='Delete'
              />
            }
          />
        </li>
      );
    }

  }

  renderDeleteRow(id) {
    if (this.props.deletable) {
      return (
        <TableRowColumn >
          <FlatButton
            primary
            onClick={ this.handleDelete(id) }
            label={
              <FormattedMessage
                id='Delete'
                defaultMessage='Delete'
              />
            }
          />
        </TableRowColumn>
      );
    }

  }
  renderDeleteColumn() {
    if (this.props.deletable) {
      return (
        <TableHeaderColumn key='delete'>
          <FormattedMessage
            id='Delete'
            defaultMessage='Delete'
          />
        </TableHeaderColumn>
      );
    }
  }
  handleDelete(id) {
    const { locale } = this.props;

    return () => {
      const requestParams = {
        url: `/availabilities/${id}`,
        method: 'DELETE',
        successCallBack: () => {
          location.assign(formatLink('/availabilities', locale));
        },
        errorCallBack: (message) => {
          this.setState({
            message,
            showSnackBar: true
          });

          setTimeout(() => {
            this.handleHideSnackBar();
          }, 2000);
        }
      };

      return postData(requestParams);
    };
  }

  renderSnackBar() {
    if (this.state.showSnackBar) {
      return <SnackBarComponent open={ this.state.showSnackBar } message={ this.state.message } />;
    }
  }

  handleHideSnackBar() {
    this.setState({
      showSnackBar: false
    });
  }
}

AvailabilitiesTable.propTypes = {
  availabilities: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
  timezone: PropTypes.string,
  locale: PropTypes.string,
  deletable: PropTypes.bool
};

AvailabilitiesTable.defaultProps = {
  availabilities: {},
  timezone: '',
  locale: '',
  deletable: false
};

export default AvailabilitiesTable;
