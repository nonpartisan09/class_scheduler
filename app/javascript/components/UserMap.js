import React, { Component } from 'react';
import { Map, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import dummyLocationData from '../../../DummyData'; // Needs actual data

const userTypes = {
  CLIENT: 'client',
  VOLUNTEER: 'volunteer',
  BOTH: 'both'
};
 
class UserMap extends Component {

    calculateTotalUsers(data, userType) {
      let totalUsers = 0;

      data.features.forEach((city) => {
        if(userType === userTypes.BOTH) {
          totalUsers+=city.properties.userCityCount;
        } else
        if(userType === userTypes.CLIENT) {
          if(city.properties.clientCount)
          totalUsers+=city.properties.clientCount;
        } else
        if(userType === userTypes.VOLUNTEER) {
          if(city.properties.volunteerCount)
          totalUsers+=city.properties.volunteerCount;
        }
      });

      console.log(totalUsers);
      return totalUsers;
    }

    createUserLocationDataCircles(data, viewClients, viewVolunteers) {
      const pointsArray = [];

      if(viewClients && viewVolunteers) {
        data.features.forEach((city) => {
          if(!city.properties.volunteerCount) {
            pointsArray.push(
                (
                  <CircleMarker
                    key={ city.properties.userCity }
                    className={ 'circle'+city.properties.userCity }
                    center={ [city.geometry.coordinates[0], city.geometry.coordinates[1]] }
                    color='#F1592A'
                    fillColor='#F1592A'
                    fillOpacity={ 0.5 }
                    radius={ this.calculateTotalUsers(data,userTypes.CLIENT)/city.properties.clientCount }
                  >
                    <Popup>
                      <h4>{ city.properties.userCity }</h4>
                      <p>
                        <FormattedMessage
                          id='HomePage.UserSelectClients'
                          default='Clients'
                        />
                        {
                        ': '+city.properties.clientCount
                        }
                      </p>
                    </Popup>
                  </CircleMarker>
              )
            );
          } else
          if(!city.properties.clientCount) {
            pointsArray.push(
                (
                  <CircleMarker
                    key={ city.properties.userCity }
                    className={ 'circle'+city.properties.userCity }
                    center={ [city.geometry.coordinates[0], city.geometry.coordinates[1]] }
                    color='#29AAE2'
                    fillColor='#29AAE2'
                    fillOpacity={ 0.5 }
                    radius={ this.calculateTotalUsers(data,userTypes.VOLUNTEER)/city.properties.volunteerCount }
                  >
                    <Popup>
                      <h4>{ city.properties.userCity }</h4>
                      <p>
                        <FormattedMessage
                          id='HomePage.UserSelectVolunteers'
                          default='Volunteers'
                        />
                        {
                        ': '+city.properties.volunteerCount
                        }
                      </p>
                    </Popup>
                  </CircleMarker>
              )
            );
          } else {
            pointsArray.push(
              (
                <CircleMarker
                  key={ city.properties.userCity }
                  className={ 'circle'+city.properties.userCity }
                  center={ [city.geometry.coordinates[0], city.geometry.coordinates[1]] }
                  color='#29AAE2'
                  fillColor='#F1592A'
                  fillOpacity={ 0.5 }
                  radius={ this.calculateTotalUsers(data,userTypes.BOTH)/city.properties.userCityCount }
                >
                  <Popup>
                    <h4>{ city.properties.userCity }</h4>
                    <p>
                      <FormattedMessage
                        id='HomePage.UserSelectClients'
                        default='Clients'
                      />
                      {
                      ': '+city.properties.clientCount
                      }
                    </p>
                    <p>
                      <FormattedMessage
                        id='HomePage.UserSelectVolunteers'
                        default='Volunteers'
                      />
                      {
                      ': '+city.properties.volunteerCount
                      }
                    </p>
                  </Popup>
                </CircleMarker>
            )
          );
        }});
      } else
      if(viewClients && !viewVolunteers) {
        data.features.forEach((city) => {
          if(city.properties.clientCount) {
            pointsArray.push(
                (
                  <CircleMarker
                    key={ city.properties.userCity }
                    className={ 'circle'+city.properties.userCity }
                    center={ [city.geometry.coordinates[0], city.geometry.coordinates[1]] }
                    color='#F1592A'
                    fillColor='#F1592A'
                    fillOpacity={ 0.5 }
                    radius={ this.calculateTotalUsers(data,userTypes.CLIENT)/city.properties.clientCount }
                  >
                    <Popup>
                      <h4>{ city.properties.userCity }</h4>
                      <p>
                        <FormattedMessage
                          id='HomePage.UserSelectClients'
                          default='Clients'
                        />
                        {
                        ': '+city.properties.clientCount
                        }
                      </p>
                    </Popup>
                  </CircleMarker>
              )
            );
          }
        });
      } else
      if(!viewClients && viewVolunteers) {
        data.features.forEach((city) => {
          if(city.properties.volunteerCount) {
            pointsArray.push(
                (
                  <CircleMarker
                    key={ city.properties.userCity }
                    className={ 'circle'+city.properties.userCity }
                    center={ [city.geometry.coordinates[0], city.geometry.coordinates[1]] }
                    color='#29AAE2'
                    fillColor='#29AAE2'
                    fillOpacity={ 0.5 }
                    radius={ this.calculateTotalUsers(data,userTypes.VOLUNTEER)/city.properties.volunteerCount }
                  >
                    <Popup>
                      <h4>{ city.properties.userCity }</h4>
                      <p>
                        <FormattedMessage
                          id='HomePage.UserSelectVolunteers'
                          default='Volunteers'
                        />
                        {
                        ': '+city.properties.volunteerCount
                        }
                      </p>
                    </Popup>
                  </CircleMarker>
              )
            );
          }
        });
      }
      return pointsArray;
    }

  render() {
    return (
      <div className='userMapContainer'>
        <Map
          center={ this.props.view === 'row' ? [40.4637, -3.7492] : [37.0902, -95.7129] }
          zoom={ this.props.view === 'row' ? 1.5 : 4 }
          style={ {height: '50vh', width: '70vw'} }
          minZoom={ 1.5 }
          maxBounds={ this.props.view === 'row' ? [[85, -180], [-85, 180]] : [[50.5933, -136.5005], [14.3868, -67.5503]] }
        >
          { this.createUserLocationDataCircles(dummyLocationData, this.props.viewClients, this.props.viewVolunteers) }
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
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
 
export default UserMap;