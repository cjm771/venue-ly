import React from 'react';
import css from '../../css/style.css';
import Map from './components/Map.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Map />
      </div>
    );
  }
};