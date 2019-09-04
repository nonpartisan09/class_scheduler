import React, { Component } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';

const addressPoints = [
    //Data in LatLong to pass to component format [lat, long, intensity]
];
 
class UserMap extends Component {
  render() {
    return (
      <div className='userMapContainer'>
        <Map
          center={ [40.4637, -3.7492] }
          zoom={ 1.5 }
          style={ {height: '50vh', width: '70vw'} }
        >
          <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
            points={ addressPoints }
            longitudeExtractor={ m => m[1] }
            latitudeExtractor={ m => m[0] }
            intensityExtractor={ m => parseFloat(m[2]) } />
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