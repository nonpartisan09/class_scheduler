import React, { Component } from 'react';
import { Map, TileLayer, CircleMarker, Popup, Circle} from 'react-leaflet';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

export default class UserMap extends Component{
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state = {
      zoom: 1,
      mapCenter: [0,0],
      cities: [],
      newyork: [],
      feature: null,
      hostUrl: window.location.href,
    };
  }

  onClick(e){
    const feature = e.target.feature;
  }

  componentDidMount = () => {
    fetch(this.state.hostUrl + '/api/v1/city')
        .then(res => res.json())
        .then(data => {
          this.setState({cities: data.features});
        });
    fetch(this.state.hostUrl + '/api/v1/empty')
          .then(res => res.json())
          .then(data => {
              this.setState({newyork: data.features});
          });
  };
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
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
     {this.state.cities.map(cities => {
        let city = cities.properties['userCity'];
        let userCityCount = cities.properties['userCityCount'];
        let clientCount = cities.properties['clientCount'];
        let volunteerCount = cities.properties['volunteerCount'];
        let totalClientCount = cities.properties['totalClientCount'];
        let totalVolunteerCount = cities.properties['totalVolunteerCount'];
        let origin = [cities.geometry.coordinates[0]['latitude'], cities.geometry.coordinates[0]['longitude']];

        if(this.props.viewClients && !this.props.viewVolunteers)
        return (
              <CircleMarker
                  key={ city+'client' }
                  className={ 'circle'+city}
                  center={origin}
                  color='#F1592A'
                  fillColor='#F1592A'
                  fillOpacity={ 0.5 }
                  radius={(clientCount/totalClientCount) * 100 *.40  }
              >
                <Popup>
                  <h4>{ city }</h4>
                  <p>
                    <FormattedMessage
                        id='HomePage.UserSelectClients'
                        default='Clients'
                    />
                    {
                      ': '+clientCount
                    }
                  </p>
                </Popup>
              </CircleMarker>
        );
        else if(this.props.viewVolunteers && !this.props.viewClients)
          return(
              <CircleMarker
                  key={ city+'volunteer' }
                  className={ 'circle'+city}
                  center={origin}
                  color='#29AAE2'
                  fillColor='#29AAE2'
                  fillOpacity={ 0.5 }
                  radius={(volunteerCount/totalVolunteerCount) * 100 *.40 }
              >
                <Popup>
                  <h4>{ city }</h4>
                  <p>
                    <FormattedMessage
                        id='HomePage.UserSelectVolunteers'
                        default='Volunteers'
                    />
                    {
                      ': '+volunteerCount
                    }
                  </p>
                </Popup>
              </CircleMarker>
          );
        else if(this.props.viewClients && this.props.viewVolunteers)
          return(
              <CircleMarker
                  key={ city+'both' }
                  className={ 'circle'+city}
                  center={origin}
                  color='#17294d'
                  fillColor='#17294d'
                  fillOpacity={ 0.5 }
                  radius={(volunteerCount+clientCount/userCityCount)*.40}
              >
                <Popup>
                  <h4>{ city }</h4>
                  <p>
                    <FormattedMessage
                        id='HomePage.UserSelectClients'
                        default='Clients'
                    />
                    {
                      ': '+clientCount
                    }
                  </p>
                  <p>
                    <FormattedMessage
                        id='HomePage.UserSelectVolunteers'
                        default='Volunteers'
                    />
                    {
                      ': '+volunteerCount
                    }
                  </p>
                </Popup>
              </CircleMarker>
          );
      })}
                    {this.state.newyork.map(newyork => {
                          let city = newyork.properties['userCity'];
                          let userCityCount = newyork.properties['userCityCount'];
                          let clientCount = newyork.properties['clientCount'];
                          let volunteerCount = newyork.properties['volunteerCount'];
                          let totalClientCount = newyork.properties['totalClientCount'];
                          let totalVolunteerCount = newyork.properties['totalVolunteerCount'];
                          let origin = [newyork.geometry.coordinates[0], newyork.geometry.coordinates[1]];

                          if(this.props.viewClients && !this.props.viewVolunteers)
                              return (
                                <CircleMarker
                                  key={ city+'client' }
                                  className={ 'circle'+city }
                                  center={ origin }
                                  color='#F1592A'
                                  fillColor='#F1592A'
                                  fillOpacity={ 0.5 }
                                  radius={ (clientCount/totalClientCount) * 100 *.40 }
                                  >
                                  <Popup>
                                    <h4>{ city }</h4>
                                    <p>
                                      <FormattedMessage
                                        id='HomePage.UserSelectClients'
                                        default='Clients'
                                              />
                                      {
                                                  ': '+clientCount
                                              }
                                    </p>
                                  </Popup>
                                </CircleMarker>
                              );
                          else if(this.props.viewVolunteers && !this.props.viewClients)
                              return(
                                <CircleMarker
                                  key={ city+'volunteer' }
                                  className={ 'circle'+city }
                                  center={ origin }
                                  color='#29AAE2'
                                  fillColor='#29AAE2'
                                  fillOpacity={ 0.5 }
                                  radius={ (volunteerCount/totalVolunteerCount) * 100 *.40 }
                                  >
                                  <Popup>
                                    <h4>{ city }</h4>
                                    <p>
                                      <FormattedMessage
                                        id='HomePage.UserSelectVolunteers'
                                        default='Volunteers'
                                              />
                                      {
                                                  ': '+volunteerCount
                                              }
                                    </p>
                                  </Popup>
                                </CircleMarker>
                              );
                          else if(this.props.viewClients && this.props.viewVolunteers)
                              return(
                                <CircleMarker
                                  key={ city+'both' }
                                  className={ 'circle'+city }
                                  center={ origin }
                                  color='#17294d'
                                  fillColor='#17294d'
                                  fillOpacity={ 0.5 }
                                  radius={ (volunteerCount+clientCount/userCityCount)*.40 }
                                  >
                                  <Popup>
                                    <h4>{ city }</h4>
                                    <p>
                                      <FormattedMessage
                                        id='HomePage.UserSelectClients'
                                        default='Clients'
                                              />
                                      {
                                                  ': '+clientCount
                                              }
                                    </p>
                                    <p>
                                      <FormattedMessage
                                        id='HomePage.UserSelectVolunteers'
                                        default='Volunteers'
                                              />
                                      {
                                                  ': '+volunteerCount
                                              }
                                    </p>
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