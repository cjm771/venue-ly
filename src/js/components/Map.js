// ES6
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

// ES5
var ReactMapboxGl = require("react-mapbox-gl");
var Layer = ReactMapboxGl.Layer;
var Feature = ReactMapboxGl.Feature;

const Map = ReactMapboxGl({
  accessToken: process.env.MAPBOX_ACCESSTOKEN
});

// in render()
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