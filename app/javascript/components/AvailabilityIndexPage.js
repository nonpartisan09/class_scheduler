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
    const { currentUser: { untimely_responses, timely_responses }, availabilities: availabilities } = this.props;
    const canReactivate = !untimely_responses;
    const isDeactivated = !!timely_responses.length;
    const isActive = canReactivate && !isDeactivated;

    return (
      <div>
        <Paper zDepth={ 1 } className={ isDeactivated ? 'paperOverride untimelyResponses' : 'paperOverride' } rounded={ false }>
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
                { isActive ? 'active.' : 'inactive.' }
                <span className='reinstateAvailabilityText'>
                  { canReactivate ? '' : ' To re-enable availabilities, please respond to all client volunteer requests that are more than two days old and then click the "Reactivate Availablities" button.'}
                </span>
              </div>
              &nbsp;&nbsp;
              {
                !!availabilities.length && (
                  <RaisedButton
                    primary
                    disabled={ !canReactivate }
                    onClick={ timely_responses.length ? () => this.toggleAvailabilities('DELETE') : () =>this.toggleAvailabilities('POST') }
                    label={ (
                      <FormattedMessage
                        id='UntimelyResponses'
                        defaultMessage={ timely_responses.length ? 'Reactivate Availabilities' : 'Deactivate Availabilities' }
                      />
                    ) }
                  />
                )
              }
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
    const { availabilities, currentUser: { timezone, locale, timely_responses } } = this.props;

    if ( _.size(availabilities) > 0 ) {
      return (
        <ul className='availabilityIndexListContainer'>
          <AvailabilitiesTable
            availabilities={ availabilities }
            timezone={ timezone }
            locale={ locale }
            deletable
            timely_responses={ timely_responses }
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

  toggleAvailabilities(type){
    const { currentUser: { locale, timely_responses } } = this.props;
    console.log(timely_responses);
    console.log(locale);
    let url;

    if (type === 'DELETE'){
      url = '/timely_responses/' + timely_responses[0].id;
    } else {
      url = '/timely_responses';
    }

    const requestParams = {
      url: url,
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
    timely_responses: PropTypes.array,
    first_name: PropTypes.string,
    email: PropTypes.string,
    timezone: PropTypes.string,
    locale: PropTypes.string,
    untimely_responses: PropTypes.bool,
    id: PropTypes.number
  })
};

AvailabilityIndexPage.defaultProps = {
  availabilities: [],
  programs: [],
  currentUser: {
    timely_responses: [],
    first_name: '',
    email: '',
    timezone: '',
    locale: ENGLISH,
    untimely_responses: false,
    id: 0
  }
};

export default AvailabilityIndexPage;
