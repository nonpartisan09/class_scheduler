import React, { Component } from 'react';
import { Map, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

export default class UserMap extends Component {
  constructor (props) {
    super(props);
    this.state = {
      cities: [],
    };
  }

  componentDidMount = () => {
    fetch(window.location.origin + '/users/cities')
      .then(res => res.json())
      .then(data => {
        this.setState({ cities: data.cities });
      });
  }

  // Helper methods for different view options (clients, volunteers or both)
  clientPopUp = ({client_count}) => {
    return (
      <p>
        <FormattedMessage id='HomePage.UserSelectClients' default='Clients' />
        {': ' + client_count}
      </p>
    );
  };

  volunteerPopUp = ({volunteer_count }) => {
    return (
      <p>
        <FormattedMessage
          id='HomePage.UserSelectVolunteers'
          default='Volunteers'
        />
        {': ' + volunteer_count}
      </p>
    );
  }

  allPopUp = ({client_count, volunteer_count}) => {
    return (
      <React.Fragment>
        <p>
          <FormattedMessage
            id='HomePage.UserSelectClients'
            default='Clients'
          />
          {': ' + client_count}
        </p>
        <p>
          <FormattedMessage
            id='HomePage.UserSelectVolunteers'
            default='Volunteers'
          />
          {': ' + volunteer_count}
        </p>
      </React.Fragment>
    );
  }

  clientColor = () => '#F1592A';
  volunteerColor = () => '#29AAE2';
  allColor = ({client_count, volunteer_count}) => {
    if (client_count === 0) return this.volunteerColor();
    else if (volunteer_count === 0)
      return this.clientColor();
    else return '#17294d';
  };

  render () {
    // assign helper methods based on view selected
    let getColor = null;
    let popUp = null;

    if (this.props.viewClients && !this.props.viewVolunteers) {
      getColor = this.clientColor;
      popUp = this.clientPopUp;
    } else if (this.props.viewVolunteers && !this.props.viewClients) {
      getColor = this.volunteerColor;
      popUp = this.volunteerPopUp;
    } else if (this.props.viewVolunteers && this.props.viewClients) {
      getColor = this.allColor;
      popUp = this.allPopUp;
    }

    return (
      <div className='userMapContainer'>
        <Map
          center={
            this.props.view === 'row' ? [40.4637, -3.7492] : [37.0902, -95.7129]
          }
          zoom={ this.props.view === 'row' ? 1.5 : 4 }
          style={ { height: '50vh', width: '70vw' } }
          minZoom={ 1.5 }
          maxBounds={
            this.props.view === 'row'
              ? [
                  [85, -180],
                  [-85, 180]
                ]
              : [
                  [50.5933, -136.5005],
                  [14.3868, -67.5503]
                ]
          }
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {this.state.cities.map(city => {
            let name = city.name;
            let origin = [
              city.coordinates[0],
              city.coordinates[1]
            ];
            if (!getColor) return null;
            return (
              <CircleMarker
                key={ uuid() }
                className='circle'
                center={ origin }
                color={ getColor(city) }
                fillColor={ getColor(city) }
                fillOpacity={ 0.5 }
                radius={ 5 }
              >
                <Popup>
                  <h4>{name}</h4>
                  {popUp(city)}
                </Popup>
              </CircleMarker>
            );
          })}
        </Map>
      </div>
    );
  }
}

UserMap.propTypes = {
  view: PropTypes.string.isRequired,
  viewClients: PropTypes.bool.isRequired,
  viewVolunteers: PropTypes.bool.isRequired
};
