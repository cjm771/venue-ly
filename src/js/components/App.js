import React from 'react';
import css from '../../css/style.css';
import MapView from './Map.js';
import {Header, MainContent, LeftSlider, RightSlider, SliderLayout} from './SliderLayout.js';
import EventView from './EventView.js';
import  {AudioAnalyzerNode} from './AudioAnalyzerNode';
import MusicVisualizer from './MusicVisualizer';

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
      activeTrackEvent: null,
      activeTrackArtist: null,
      activeTrack: null,
      musicAnalysisBars: null
    }
    this.onMarkerClick = this.onMarkerClick.bind(this);
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


  killEventPane() {
    this.setState({
      activeEvent: null,
      loadingEventView: true,
      rightOn: false,
      leftOn: false
    });
  }

  onMarkerClick(event) {
    if (event === null) {
      // clicked on map
      this.killEventPane();
    } else if ((this.state.activeEvent!==null && event.id === this.state.activeEvent.id)) {
      // clicked same event
      this.killEventPane();
    } else {
      this.setState({
        activeEvent: event,
        rightOn: true,
        leftOn: false
      }, () => {
          // ok here we'll query for our top tracks from artist and get results
          this.fetchArtistInfo(this.state.activeEvent, 0);
      });
   
    }
  }

  onPlayPauseWidget(track, wasPlaying) {
    this.setState({
      audioPlaying: (wasPlaying) ? false : true
    });
  }

  onPlayPause(track, wasPlaying) {
    this.setState({
      audioPlaying: (wasPlaying) ? false : true,
      activeTrack: (wasPlaying) ? null : track,
      activeTrackArtist: (wasPlaying) ? null : this.state.activeArtist,
      activeTrackEvent: (wasPlaying) ? null : this.state.activeEvent
    });
  }


// react assigns active but our node will control its css from here
  adjustMarkerScaleBasedOnMusic(level) {
      const markers = document.querySelectorAll('.marker_scale_wpr');
      markers.forEach((marker) => {
        if (marker.classList.contains('active') && this.state.audioPlaying) {  
          marker.style.transform = `scale(${1 + level * 1})`;
        } else {
          marker.style.transform = `scale(1)`;
        }
      });
  }
  onAudioAnalyze(level, bars) {
    this.adjustMarkerScaleBasedOnMusic(level);
    this.setState({
      musicAnalysisBars: bars
    });
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
            onMarkerClick={this.onMarkerClick} 
            activeEvent={this.state.activeEvent} 
            activeTrack={this.state.activeTrack}
            isPlaying={this.state.audioPlaying}
            events={this.state.events}
          />
          <AudioAnalyzerNode 
            url={(this.state.activeTrack) ? this.state.activeTrack.preview_url : null}
            play={this.state.audioPlaying}
            onAnalyze={this.onAudioAnalyze.bind(this)}
          />
          <MusicVisualizer 
            track={this.state.activeTrack}
            artist={this.state.activeTrackArtist}
            event={this.state.activeTrackEvent}
            isPlaying={this.state.audioPlaying}
            analysisBar={this.state.musicAnalysisBars}
            onSongClick={this.onPlayPauseWidget.bind(this)}
          />
        </MainContent>
          <RightSlider >
          <EventView 
            activeTrack={this.state.activeTrack}
            event={this.state.activeEvent} 
            artist={this.state.activeArtist} 
            loading={this.state.loadingEventView}
            soundPlaying={this.state.audioPlaying}
            onSongClick={this.onPlayPause.bind(this)}
          />
        </RightSlider>
      </SliderLayout>
    );
  }
};