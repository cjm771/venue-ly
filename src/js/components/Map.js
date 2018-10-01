import React from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import {MAPBOX_ACCESS_TOKEN} from '../config/config.json';

const Map = ReactMapboxGl({
  accessToken: MAPBOX_ACCESS_TOKEN
});

// in render()
const MapView= () => (
<Map
  style="mapbox://styles/mapbox/streets-v9"
  containerStyle={{
    height: "100vh",
    width: "100vw"
  }}>
    <Layer
      type="symbol"
      id="marker"
      layout={{ "icon-image": "marker-15" }}>
      <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
    </Layer>
</Map>
);

export default MapView;