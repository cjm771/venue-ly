import React from 'react';
import ReactMapboxGl, { Marker, Layer, Feature } from "react-mapbox-gl";
import Pin from './Pin';
import {MAPBOX_ACCESS_TOKEN} from '../config/config.json';

const Map = ReactMapboxGl({
  accessToken: MAPBOX_ACCESS_TOKEN
});

// in render()
const MapView= (props) => (
<Map
  style="mapbox://styles/mapbox/light-v9"
  containerStyle={{
    height: "100vh",
    width: "100vw"
  }}>


      {
        props.events.map((event, index) => {
        console.log(event);
        return (
          <Marker  key = {index} coordinates={[event.venue.lng, event.venue.lat]}>
          <Pin />
          </Marker>
        );
      })}
   

</Map>
);

export default MapView;