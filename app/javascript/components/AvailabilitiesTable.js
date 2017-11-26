import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import './AvailabilitiesTable.css';

class AvailabilitiesTable extends Component {

  render() {
    const { availabilities } = this.props;

    const tableContent =  _.map(availabilities, ({ day, start_time, end_time, timezone }) => {
      return(
        <TableRow className='availabilitiesTableRow' key={ 'body' + day }>
          <TableRowColumn>{ day }</TableRowColumn>
          <TableRowColumn>From: { moment(start_time).format('HH:MM') }</TableRowColumn>
          <TableRowColumn>To: { moment(end_time).format('HH:MM') }</TableRowColumn>
          <TableRowColumn >Timezone: { timezone }</TableRowColumn>
        </TableRow>
      );
    });

    const listContent =  _.map(availabilities, ({ day, start_time, end_time, timezone }) => {
      return(
        <div key={ 'list' + day + timezone } className='availabilityIndexItemContainer'>
          <li>
            <span>Day: </span>{ day }
          </li>

          <li>
            <span>From: </span>{ moment(start_time).format('HH:MM') }
          </li>
          <li>
            <span>To: </span>{ moment(end_time).format('HH:MM') }
          </li>

          <li>
            <span>Timezone: </span>{ timezone }
          </li>
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
              </TableRow>
            </TableHeader>

            <TableBody displayRowCheckbox={ false }>
              { tableContent}
            </TableBody>
          </Table>
        </div>

        <div className='tableHideMediumScreen'>
          { listContent }
        </div>
      </div>
    );
  }

}

AvailabilitiesTable.propTypes = {
 availabilities: PropTypes.object
};

AvailabilitiesTable.defaultProps = {
 availabilities: {}
};

export default AvailabilitiesTable;
