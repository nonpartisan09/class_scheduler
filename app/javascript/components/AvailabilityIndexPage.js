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
          <div className='availabilityIndexContainer'>
            <FormattedMessage
              id='AvailabilityIndexPage.Help'
              defaultMessage='I can help with'
            />
            :
            <ul className='availabilityIndexProgramsContainer'>
              { this.renderAvailablePrograms() }
            </ul>
            <div className='activeAvailabilities'>
              <div>
                Availabilities are currently&nbsp;
                {suspended ? 'inactive.' : 'active.'}
                <span className='reinstateAvailabilityText'>
                  {can_unsuspend ? '' : ' To re-enable availabilities, please respond to all client volunteer requests that are more than two days old and then click the "Reactivate Abilitites" button.'}
                </span>
              </div>
              &nbsp;&nbsp;
              <RaisedButton
                primary
                disabled={ !can_unsuspend }
                onClick={ () => suspended ? this.suspensionClick('DELETE') : this.suspensionClick('POST') }
                label={ (
                  <FormattedMessage
                    id='Suspend'
                    defaultMessage={ suspended ? 'Reactivate Availabilities' : 'Deactivate Availabilites' }
                  />
                ) }
              />
            </div>
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
    const { availabilities, currentUser: { timezone, locale, suspended } } = this.props;

    if ( _.size(availabilities) > 0 ) {
      return (
        <ul className='availabilityIndexListContainer'>
          <AvailabilitiesTable
            availabilities={ availabilities }
            timezone={ timezone }
            locale={ locale }
            deletable
            suspended={ suspended }
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
