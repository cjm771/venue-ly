import React from 'react';
import css from '../../css/style.css';
import MapView from './Map.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    }
  }

  componentDidMount() {
    fetch('/events').then((resp) => {
      return resp.json();
    }).then((events) => {
      this.setState({
        events
      });
    });
  }

  render() {
    return (
      <div>
        <MapView events={this.state.events}/>
      </div>
    );
  }
};