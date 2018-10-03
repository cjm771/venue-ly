import React from 'react';
import ReactMapboxGl, { Marker, Layer, Feature, Popup } from "react-mapbox-gl";
import Pin from './Pin';
import {MAPBOX_ACCESS_TOKEN} from '../config/config.json';

const Map = ReactMapboxGl({
  accessToken: MAPBOX_ACCESS_TOKEN
});

// in render()
const MapView= (props) => (
(props.events.length) ? (
<Map
  onClick = {(e) => {props.onMarkerClick(null)}}
  center={(props.activeEvent) ? 
    [props.activeEvent.venue.lng, props.activeEvent.venue.lat] : 
    [ props.events[0].venue.lng, props.events[0].venue.lat]
  }
  style="mapbox://styles/mapbox/light-v9"
  containerStyle={{
    height: "100vh",
    width: "100vw"
  }}>

    {/* event markers */}
    {
      props.events.map((event, index) => {
      console.log(event);
      return (         
        <Marker 
          onClick={(e) => {props.onMarkerClick(event) }} 
          key = {event.id} 
          coordinates={[event.venue.lng, event.venue.lat]}>
        <Pin />
        </Marker>
      );
    })}

    {/* active popup  */}
    { (props.activeEvent) ? (
        <Popup 
        coordinates={[props.activeEvent.venue.lng, props.activeEvent.venue.lat]}
        offset={25}>
        <b>
          {props.activeEvent.performers.map((artist) => {return artist.name}).join(', ')}
        </b>
        <br/>
        @{props.activeEvent.venue.name }
      </Popup>)
      : ''
    }

</Map>
) : (
  ''
)
);

export default MapView;