import React from 'react';
import css from '../../css/style.css';
import MapView from './Map.js';
import {Header, MainContent, LeftSlider, RightSlider, SliderLayout} from './SliderLayout.js';
import { faHeadphonesAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      activeEvent: null,
      leftOn: false,
      rightOn: false
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

  onMenuClick() {
    this.setState({
      activeEvent: null,
      rightOn: false,
      leftOn: !this.state.leftOn
    });
  }

  onMarkerClick(event) {
    if (event === null) {
      this.setState({
        activeEvent: null,
        rightOn: false,
        leftOn: false
      });
    } else {
      const clickedSame = (this.state.activeEvent && event.id === this.state.activeEvent.id);
      console.log("right on?", this.state.rightOn);
      this.setState({
        activeEvent: clickedSame ? null : event,
        rightOn: !clickedSame,
        leftOn: false
      });
    }
  }

  render() {
    return (
      <SliderLayout leftOn={this.state.leftOn} rightOn={this.state.rightOn}>
        <Header onMenuClick={this.onMenuClick.bind(this)}>Venuely</Header>
        <LeftSlider>
          Left bar
        </LeftSlider>
        <MainContent leftOn={this.state.leftOn} rightOn={this.state.rightOn}>
          <MapView 
            onMarkerClick={this.onMarkerClick.bind(this)} 
            activeEvent={this.state.activeEvent} 
            events={this.state.events}
          />
        </MainContent>
      
          <RightSlider >
          Right bar
        </RightSlider>
      </SliderLayout>
    );
  }
};