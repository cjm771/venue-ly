import React from 'react';
import css from '../../css/style.css';
import MapView from './Map.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <MapView />
      </div>
    );
  }
};