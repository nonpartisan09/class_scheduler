import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Switch from '@material-ui/core/Switch';
import { FormattedMessage } from 'react-intl';

import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@material-ui/core';

import { postData } from './utils/sendData';
import SnackBarComponent from './reusable/SnackBarComponent';

import formatLink from './utils/Link';
import AvailabilityTimeFormatPrefs from './utils/AvailabilityTimeFormatPrefs';

const styles = {
  thumbOff: {
    backgroundColor: '#ffd6cc',
  },
  trackOff: {
    backgroundColor: '#ffb39c',
  },
};
class AvailabilitiesTable extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleHideSnackBar = this.handleHideSnackBar.bind(this);
    this.handleTimeFormatToggle = this.handleTimeFormatToggle.bind(this);

    this.state = {
      showSnackBar: false,
      message: '',
      show12HourFormat: AvailabilityTimeFormatPrefs.use12HourFormat(),
    };
  }

  render() {
    const { availabilities, timezone, timeout } = this.props;
    const { show12HourFormat } = this.state;

    const tableContent =  _.map(availabilities, ({ day, start_time, end_time, id, start_time_12_hour, end_time_12_hour  }) => {
      return(
        <TableRow className={ timeout ? 'availabilitiesTableRow untimelyRow' : 'availabilitiesTableRow' } key={ 'body' + day + start_time + end_time }>
          <TableCell>
            { day }
          </TableCell>
          <TableCell>
            { show12HourFormat ? start_time_12_hour : start_time }
          </TableCell>
          <TableCell>
            { show12HourFormat ? end_time_12_hour : end_time }
          </TableCell>
          { this.renderDeleteRow(id) }
        </TableRow>
      );
    });

    const listContent =  _.map(availabilities, ({ day, start_time, end_time, id, start_time_12_hour, end_time_12_hour }) => {
      return(
        <div 
          key={ 'list' + day + start_time + end_time + timezone } 
          className={ timeout ? 'untimelyRow availabilityTableItemContainer' : 'availabilityTableItemContainer' }>
          <li>
            <span>
              <FormattedMessage
                id='Availabilities.listDay'
                defaultMessage='Day'
              />
              : 
              { day }
            </span>
          </li>

          <li>
            <span>
              <FormattedMessage
                id='Availabilities.from'
                defaultMessage='From'
              />
              : 
              { show12HourFormat ? start_time_12_hour : start_time }
            </span>
          </li>
          <li>
            <span>
              <FormattedMessage
                id='Availabilities.to'
                defaultMessage='To'
              />
              : 
              { show12HourFormat ? end_time_12_hour : end_time }
            </span>
          </li>

          <li>
            <span>
              <FormattedMessage
                id='Availabilities.timezone'
                defaultMessage='Timezone'
              />
              : 
              { timezone }
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
        <div className='timeFormatToggleContainer'>
          <span>
            <FormattedMessage
              id='AvailabilityTable.24HourFormat'
              defaultMessage='24-Hour'
            />
          </span>
          <Switch
            label={ (                  
              <FormattedMessage
                id='AvailabilityTable.12HourFormat'
                defaultMessage='12-Hour'
              /> 
            ) }
            thumbStyle={ styles.thumbOff }
            trackStyle={ styles.trackOff }
            labelPosition="right"
            onChange={ this.handleTimeFormatToggle }
            checked={ show12HourFormat }
          />
        </div>

        <div className='tableHideSmallScreen'>
          <Table selectable={ false }>
            <TableHead displaySelectAll={ false }>
              <TableRow>
                <TableCell key='day'>
                  <FormattedMessage
                    id='Availabilities.day'
                    defaultMessage='Day'
                  />
                </TableCell>
                <TableCell key='start_time'>
                  <FormattedMessage
                    id='startTime'
                    defaultMessage='Start Time'
                  />
                </TableCell>
                <TableCell key='end_time'>
                  <FormattedMessage
                    id='endTime'
                    defaultMessage='End Time'
                  />
                </TableCell>
                { this.renderDeleteColumn() }
              </TableRow>
            </TableHead>

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
          <Button
            variant='contained'
            primary
            fullWidth
            onClick={ this.handleDelete(id) }
            label={ (
              <FormattedMessage
                id='Delete'
                defaultMessage='Delete'
              />
              ) }
          />
        </li>
      );
    }

  }

  renderDeleteRow(id) {
    if (this.props.deletable) {
      return (
        <TableCell>
          <Button
            primary
            onClick={ this.handleDelete(id) }
            label={ (
              <FormattedMessage
                id='Delete'
                defaultMessage='Delete'
              />
              ) }
          />
        </TableCell>
      );
    }

  }
  renderDeleteColumn() {
    if (this.props.deletable) {
      return (
        <TableCell key='delete'>
          <FormattedMessage
            id='Delete'
            defaultMessage='Delete'
          />
        </TableCell>
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
  
  handleTimeFormatToggle() {
    this.setState((prevState) => {
      const using12Hour = prevState.show12HourFormat;
      AvailabilityTimeFormatPrefs.toggleTimePref(using12Hour);
      return { show12HourFormat: !using12Hour };      
    });
  }
}

AvailabilitiesTable.propTypes = {
  availabilities: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
  timezone: PropTypes.string,
  locale: PropTypes.string,
  deletable: PropTypes.bool,
  timeout: PropTypes.bool
};

AvailabilitiesTable.defaultProps = {
  availabilities: {},
  timezone: '',
  locale: '',
  deletable: false,
  timeout: false
};

export default AvailabilitiesTable;
