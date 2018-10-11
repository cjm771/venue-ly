import React from 'react';
import ReactMapboxGl, { Marker, Layer, Feature, Popup } from "react-mapbox-gl";
import Pin from './Pin';
import Beacon from './Beacon';
import {MAPBOX_ACCESS_TOKEN} from '../config/config.json';

const Map = ReactMapboxGl({
  accessToken: MAPBOX_ACCESS_TOKEN
});

// in render()
class MapView extends React.Component{

  constructor(props) {
    super(props);
  }


  containsActiveTrack(event, activeTrack) {
    if (activeTrack) {
      return event.id === activeTrack.associatedEvent
    } 
    return false
  }


  propsChanged(nextProps) {
    // const toCheck = ['url', 'play'];
    // debugger;
    return Object.keys(this.props).filter((key) => {
      return nextProps[key] !== this.props[key]
    }).length !== 0
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.propsChanged(nextProps);
  }

  render() {
    return (
        <Map
          onMoveEnd = {this.props.onFinishMove}
          onClick = {(e) => {this.props.onMarkerClick(null)}}
          center={this.props.center}
          fitBounds={this.props.bounds}
          fitBoundsOptions={{padding: 100}}
          style="mapbox://styles/mapbox/light-v9"
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}>
        
            
            {/* self beacon */}
            {this.props.beacon ? (
              <Marker coordinates={this.props.beacon}>
              <Beacon />
              </Marker>
              ) : (
              ''
            )}
           {/* event markers */}
            { (this.props.events.length > 0 ) ? (
              this.props.events.map((event) => {
              return (         
                <Marker 
                  onClick={(e) => {this.props.onMarkerClick(event) }} 
                  key = {event.id} 
                  coordinates={[event.venue.lng, event.venue.lat]}>
                <Pin active={this.containsActiveTrack(event, this.props.activeTrack)} />
                </Marker>
              )}))
               : ''
            }
        
            {/* active popup  */}
            { (this.props.activeEvent) ? (
                <Popup 
                coordinates={[this.props.activeEvent.venue.lng, this.props.activeEvent.venue.lat]}
                offset={this.containsActiveTrack(this.props.activeEvent, this.props.activeTrack) && this.props.isPlaying ? 50: 25 }>
                <b>
                  {this.props.activeEvent.performers.map((artist) => {return artist.name}).join(', ')}
                </b>
                <br/>
                @{this.props.activeEvent.venue.name }
              </Popup>)
              : ''
            }
        
        </Map>
    );
  }
}

export default MapView;