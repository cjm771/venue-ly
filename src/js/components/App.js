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
      // songkick events
      events: [],
      // event panel
      loadingEventView: true,
      // active things
      activeEvent: null,
      activeArtist: null, 
      // slider panels
      leftOn: false,
      rightOn: false,
      // music based stuff
      audioPlaying: false,
      activeTrack: null,
      musicAnalysisBars: null
    }
   
  }

  componentDidMount() {
    this.fetchEvents();
  }

  // this helps to identify which event for map animaiton for music
  attachEventIdToArtistsTracks(event, artist) {
    artist.topTracks = artist.topTracks.map((track) => {
      track.associatedEvent = event.id;
      return track;
    });
    return artist;
  }

  fetchArtistInfo(event, performerIndex=0) {
    const performer = event.performers[performerIndex];
    fetch('/topTracks/'+encodeURIComponent(performer.name)).then((resp) => {
      return resp.json();
    }).then((resp) => {
      if (resp.error) {
        throw JSON.stringify(resp.error);
      } else {
        // lets put our event id in artist track data
        const artist = this.attachEventIdToArtistsTracks(event, resp);
        this.setState({
          loadingEventView: false,
          activeArtist: artist
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
          this.fetchArtistInfo(this.state.activeEvent, 0);
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


// react assigns active but our node will control its css from here
  adjustMarkerScaleBasedOnMusic(level) {
      const markers = document.querySelectorAll('.marker_scale_wpr');
      markers.forEach((marker) => {
        if (marker.classList.contains('active')) {  
          marker.style.transform = `scale(${1 + level * 1})`;
        } else {
          marker.style.transform = `scale(1)`;
        }
      });
  }
  onAudioAnalyze(level, bars) {
    this.adjustMarkerScaleBasedOnMusic(level);
    // this.setState({
    //   // musicAnalysisAmplitude: level,
    //   musicAnalysisBars: bars
    // });
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
            activeTrack={this.state.activeTrack}
            events={this.state.events}
          />
          <AudioAnalyzerNode 
            url={(this.state.activeTrack) ? this.state.activeTrack.preview_url : null}
            play={this.state.audioPlaying}
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