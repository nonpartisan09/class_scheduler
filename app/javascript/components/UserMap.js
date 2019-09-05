import React, { Component } from 'react';
import { Map, TileLayer, CircleMarker, Popup } from 'react-leaflet';

import dummyLocationData from '../../../DummyData'; // Needs actual data
 
class UserMap extends Component {
    createUserLocationDataCircles(data) {
      const pointsArray = [];
      const circleMultiplier = 0.2;

      data.features.forEach((city) => {
            pointsArray.push(
                (
                  <CircleMarker
                    key={ city.properties.userCity }
                    className={ 'circle'+city.properties.userCity }
                    center={ [city.geometry.coordinates[0], city.geometry.coordinates[1]] }
                    color='#0080FF'
                    fillColor='#F1592A'
                    fi
                    radius={ city.properties.userCityCount*circleMultiplier }
                  >
                    <Popup>
                      <p>{ city.properties.userCity }</p>
                      <p>{ 'Clients: '+city.properties.clientCount }</p>
                      <p>{ 'Volunteers: '+city.properties.volunteerCount }</p>
                    </Popup>
                  </CircleMarker>
              )
            );
        });
        return pointsArray;
    }

  render() {
    return (
      <div className='userMapContainer'>
        <Map
          center={ [40.4637, -3.7492] }
          zoom={ 1.5 }
          style={ {height: '50vh', width: '70vw'} }
          minZoom={ 1.5 }
          maxBounds={ [[85, -180], [-85, 180]] }
        >
          { this.createUserLocationDataCircles(dummyLocationData) }
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