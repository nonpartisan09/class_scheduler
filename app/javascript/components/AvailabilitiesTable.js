import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import { postData } from './sendData';
import SnackBarComponent from './reusable/SnackBarComponent';

import './AvailabilitiesTable.css';

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
          <TableRowColumn>{ day }</TableRowColumn>
          <TableRowColumn>From: { start_time }</TableRowColumn>
          <TableRowColumn>To: { end_time }</TableRowColumn>
          <TableRowColumn >Timezone: { timezone }</TableRowColumn>
          { this.renderDeleteRow(id) }
        </TableRow>
      );
    });

    const listContent =  _.map(availabilities, ({ day, start_time, end_time, id }) => {
      return(
        <div key={ 'list' + day + start_time + end_time + timezone } className='availabilityIndexItemContainer'>
          <li>
            <span>Day: </span>{ day }
          </li>

          <li>
            <span>From: </span>{ start_time }
          </li>
          <li>
            <span>To: </span>{ end_time }
          </li>

          <li>
            <span>Timezone: </span>{ timezone }
          </li>

          { this.renderDeleteListContent(id) }
        </div>
      );
    });


    return (
      <div>
        <div className='tableHideSmallScreen'>
          <Table selectable={ false } >
            <TableHeader displaySelectAll={ false }>
              <TableRow>
                <TableHeaderColumn key='day' >Day</TableHeaderColumn>
                <TableHeaderColumn key='start_time'>Start time</TableHeaderColumn>
                <TableHeaderColumn key='end_time'>End Time</TableHeaderColumn>
                <TableHeaderColumn key='timezone'>Timezone</TableHeaderColumn>
                { this.renderDeleteColumn() }
              </TableRow>
            </TableHeader>

            <TableBody displayRowCheckbox={ false }>
              { tableContent}
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
          <RaisedButton primary fullWidth label='Delete' onClick={ this.handleDelete(id) } />
        </li>
      );
    }

  }

  renderDeleteRow(id) {
    if (this.props.deletable) {
      return (
        <TableRowColumn >
          <FlatButton label='Delete' primary onClick={ this.handleDelete(id) } />
        </TableRowColumn>
      );
    }

  }
  renderDeleteColumn() {
    if (this.props.deletable) {
      return (
        <TableHeaderColumn key='delete'>Delete</TableHeaderColumn>
      );
    }
  }
  handleDelete(id) {
    return () => {
      const requestParams = {
        url: `/availabilities/${id}`,
        method: 'DELETE',
        successCallBack: () => {
          location.assign('/availabilities');
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
  deletable: PropTypes.bool
};

AvailabilitiesTable.defaultProps = {
  availabilities: {},
  timezone: '',
  deletable: false
};

export default AvailabilitiesTable;
