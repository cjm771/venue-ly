import React from 'react';
import css from '../../css/style.css';
import MapView from './Map.js';
import {Header, MainContent, LeftSlider, RightSlider, SliderLayout} from './SliderLayout.js';
import EventView from './EventView.js';
import { AudioAnalyzerNode } from './AudioAnalyzerNode';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      activeEvent: null,
      leftOn: false,
      rightOn: false,
      loadingEventView: true,
      audioPlaying: false,
      activeTrack: null
    }
   
  }

  componentDidMount() {
    this.fetchEvents();
  }

  fetchArtistInfo(performer) {
    fetch('/topTracks/'+encodeURIComponent(performer.name)).then((resp) => {
      return resp.json();
    }).then((resp) => {
      if (resp.error) {
        throw JSON.stringify(resp.error);
      } else {
        this.setState({
          loadingEventView: false,
          activeArtist: resp
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  fetchEvents() {
    fetch('/events').then((resp) => {
      return resp.json();
    }).then((events) => {
      this.setState({
        events
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  onMenuClick() {
    this.setState({
      activeEvent: null,
      loadingEventView: true,
      rightOn: false,
      leftOn: !this.state.leftOn
    });
  }

  onMarkerClick(event) {
    if (event === null) {
      this.setState({
        activeEvent: null,
        loadingEventView: true,
        rightOn: false,
        leftOn: false
      });
    } else {
      const clickedSame = (this.state.activeEvent && event.id === this.state.activeEvent.id);
      this.setState({
        activeEvent: clickedSame ? null : event,
        rightOn: !clickedSame,
        leftOn: false
      }, () => {
          // ok here we'll query for our top tracks from artist and get results
          this.fetchArtistInfo(this.state.activeEvent.performers[0]);
      });
   
    }
  }

  onPlayPause(track, wasPlaying) {
    console.log('happening...');
    this.setState({
      audioPlaying: (wasPlaying) ? false : true ,
      activeTrack: (wasPlaying) ? null : track 
    });
    console.log('track clicked!', track, wasPlaying);
  }

  onAudioReady(aa) {
    // console.log('audio ready!');
    // setTimeout(() => {
    //   this.setState({audioPlaying: !this.state.audioPlaying}, () => {
    //     console.log('audio playing?', this.state.audioPlaying);
    //   });
    //   this.onAudioReady(aa);
    // }, 2000);
  }

  onAudioAnalyze(level, bars) {
    // console.log('analysis!', level, bars);
  }

  
  render() {
    return (
      <SliderLayout leftOn={this.state.leftOn} rightOn={this.state.rightOn}>
        <Header onMenuClick={this.onMenuClick.bind(this)}>Venuely &#9834;</Header>
        <LeftSlider>
          Left bar
        </LeftSlider>
        <MainContent leftOn={this.state.leftOn} rightOn={this.state.rightOn}>
          <MapView 
            onMarkerClick={this.onMarkerClick.bind(this)} 
            activeEvent={this.state.activeEvent} 
            events={this.state.events}
          />
          <AudioAnalyzerNode 
            url={(this.state.activeTrack) ? this.state.activeTrack.preview_url : null}
            play={this.state.audioPlaying}
            onReady={this.onAudioReady.bind(this)}
            onAnalyze={this.onAudioAnalyze.bind(this)}
          />
        </MainContent>
          <RightSlider >
          <EventView 
            activeTrack={this.state.activeTrack}
            event={this.state.activeEvent} 
            artist={this.state.activeArtist} 
            loading={this.state.loadingEventView}
            onSongClick={this.onPlayPause.bind(this)}
          />
        </RightSlider>
      </SliderLayout>
    );
  }
};