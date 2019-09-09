import React, { Component } from 'react';
import { Map, TileLayer, CircleMarker, Popup } from 'react-leaflet';

import dummyLocationData from '../../../DummyData'; // Needs actual data
 
class UserMap extends Component {

    createUserLocationDataCircles(data, viewClients, viewVolunteers) {
      const pointsArray = [];
      const circleMultiplier = 0.2;

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
                    radius={ city.properties.clientCount*circleMultiplier }
                  >
                    <Popup>
                      <h4>{ city.properties.userCity }</h4>
                      <p>{ 'Clients: '+city.properties.clientCount }</p>
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
                    radius={ city.properties.volunteerCount*circleMultiplier }
                  >
                    <Popup>
                      <h4>{ city.properties.userCity }</h4>
                      <p>{ 'Volunteers: '+city.properties.volunteerCount }</p>
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
                  radius={ city.properties.userCityCount*circleMultiplier }
                >
                  <Popup>
                    <h4>{ city.properties.userCity }</h4>
                    <p>{ 'Clients: '+city.properties.clientCount }</p>
                    <p>{ 'Volunteers: '+city.properties.volunteerCount }</p>
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
                    radius={ city.properties.clientCount*circleMultiplier }
                  >
                    <Popup>
                      <h4>{ city.properties.userCity }</h4>
                      <p>{ 'Clients: '+city.properties.clientCount }</p>
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
                    radius={ city.properties.volunteerCount*circleMultiplier }
                  >
                    <Popup>
                      <h4>{ city.properties.userCity }</h4>
                      <p>{ 'Volunteers: '+city.properties.volunteerCount }</p>
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
 
export default UserMap;