import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import { FormattedMessage } from 'react-intl';

import { postData } from './utils/sendData';

import AvailabilitiesTable from './AvailabilitiesTable';
import formatLink from './utils/Link';

import PageHeader from './reusable/PageHeader';
import { ENGLISH } from './utils/availableLocales';

class AvailabilityIndexPage extends Component {

  render() {
    const { can_unsuspend, suspended } = this.props.currentUser;
    return (
      <div>
        <Paper zDepth={ 1 } className={ suspended ? 'paperOverride suspended' : 'paperOverride' } rounded={ false }>
          <PageHeader title={ (
            <FormattedMessage
              id='AvailabilityIndexPage.Header'
              defaultMessage='My availabilities'
            />
            ) } 
          />

          <button
            type="button"
            disabled={ !can_unsuspend }
            onClick={ () => suspended ? this.suspensionClick('DELETE') : this.suspensionClick('POST') }
          >
            {suspended ? 'Reactivate Account' : 'Pause Account'}
          </button>

          <div className='availabilityIndexContainer'>
            <FormattedMessage
              id='AvailabilityIndexPage.Help'
              defaultMessage='I can help with'
            />
            :
            <ul className='availabilityIndexProgramsContainer'>
              { this.renderAvailablePrograms() }
            </ul>

            { this.renderAvailabilities() }
          </div>
        </Paper>
      </div>
    );
  }

  renderAvailablePrograms() {
    return _.map(this.props.programs, ({ name }) => (
      <li key={ name } className='availabilityListItem'>
        <Chip key={ name }>{ name }</Chip>
      </li>
      ));
  }

  renderAvailabilities() {
    const { availabilities, currentUser: { timezone, locale } } = this.props;

    if ( _.size(availabilities) > 0 ) {
      return (
        <ul className='availabilityIndexListContainer'>
          <AvailabilitiesTable
            availabilities={ availabilities }
            timezone={ timezone }
            locale={ locale }
            deletable
          />
        </ul>
      );
    } else {
      return (
        <div>
          <a href={ formatLink('/availabilities/new', locale) }>
            <RaisedButton
              primary
              className='conversationButton'
              label={ (
                <FormattedMessage
                  id='availabilityCreateNew'
                  defaultMessage='Create new availabilities'
                />
                ) }
            />
          </a>
        </div>
      );
    }
  }

  suspensionClick(type){

    const { id, locale } = this.props.currentUser;

    const requestParams = {
      url: `/users/${id}/suspensions`,
        method: type,
        successCallBack: () => location.assign(formatLink('/availabilities', locale)),
        errorCallBack: (message) =>  console.log(message)
    };

    return postData(requestParams);



  }

}

AvailabilityIndexPage.propTypes = {
  availabilities: PropTypes.array,
  programs: PropTypes.array,
  currentUser: PropTypes.shape({
    first_name: PropTypes.string,
    email: PropTypes.string,
    timezone: PropTypes.string,
    locale: PropTypes.string,
    can_unsuspend: PropTypes.bool,
    suspended: PropTypes.bool,
    id: PropTypes.number
  })
};

AvailabilityIndexPage.defaultProps = {
  availabilities: [],
  programs: [],
  currentUser: {
    first_name: '',
    email: '',
    timezone: '',
    locale: ENGLISH,
    can_unsuspend: false,
    suspended: false,
    id: 0
  }
};

export default AvailabilityIndexPage;
