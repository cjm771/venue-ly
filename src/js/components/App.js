import React from 'react';
import css from '../../css/style.css';
import MapView from './Map.js';
import {Header, MainContent, LeftSlider, RightSlider, SliderLayout, LoadingScreen} from './SliderLayout.js';
import EventView from './EventView.js';
import  {AudioAnalyzerNode} from './AudioAnalyzerNode';
import MusicVisualizer from './MusicVisualizer';
import {MenuOptions} from './MenuOptions';
import SliderArea from './SliderArea';
import { locale } from '../../../../../../Library/Caches/typescript/3.1/node_modules/moment/moment';
import Moment from 'moment';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // locale
    const currLocaleInfo = this.loadLocaleFromLocalStorage();
    // state init
    this.state = {

      // queueEventFetch: if true..then we will delay fetch of events when anim done and then do it
      queueEventFetch: false,
      // menu stuff
      menuErrorMessage: '',
      menuLoadingMessage: false,
      isLoading: false, 
      currentSearchLocale: currLocaleInfo,
      // center
      bounds: this.getBoundsWithNMileRadius(currLocaleInfo.coords, 5),
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
    if (!this.state.currentSearchLocale.id) {
      this.onLocationClick();
    } else {
      console.log('fetching events...');
      this.fetchEvents(this.state.currentSearchLocale.id, this.state.currentSearchLocale.date);
    }
  }

  getEndLngLat(coords, angle, distance) {
    // convert mi to meters
    distance = 1609.34 * distance;
    const degToRad = (deg) => {
      return deg * (Math.PI / 180);
    };
    const radToDeg = (rad) => {
      return rad * 180 / Math.PI
    }
    angle = degToRad(angle);
    coords = coords.map((angle) => {return degToRad(angle)});
    
    
    const [lng1, lat1] = coords;
    const R = 6378137;
    const lat2 = Math.asin( Math.sin(lat1)*Math.cos(distance/R) +
                    Math.cos(lat1)*Math.sin(distance/R)*Math.cos(angle) );
    const lng2 = lng1 + Math.atan2(Math.sin(angle)*Math.sin(distance/R)*Math.cos(lat1),
                    Math.cos(distance/R)-Math.sin(lat1)*Math.sin(lat2));
    coords =  coords.map((rad) => {return radToDeg(rad)});
    const newCoords = [lng2, lat2].map((rad) => {return radToDeg(rad)});
    return newCoords;
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

  getBounds(arr) {
    console.log(arr);
    arr = Array.isArray(arr[0]) ? arr : [arr];
    const bounds =  arr.reduce((acc, [currLng, currLat]) => {
      // min[0] = lng, min[1]= lat
      //  min[0] = lng
      const [[minLng, minLat], [maxLng, maxLat]] = acc;
      const min = [Math.min(minLng, currLng), Math.min(minLat, currLat)];
      const max = [Math.max(maxLng, currLng), Math.max(maxLat, currLat)];
      return [min, max];
    }, [arr[0], arr[0]]);
    return bounds;
  }

  getBoundsWithNMileRadius(coords, n) {
    return [this.getEndLngLat(coords, 45, n/2),
    this.getEndLngLat(coords, 225, n/2)]
  }

  fetchEvents(metroAreaId, date) {
    fetch(`/events/${metroAreaId}`).then((resp) => {
      return resp.json();
    }).then((events) => {
      this.setState({
        events,
        // bounds: (events.length) ? this.getBounds(events.map((event) => {
        //   return [event.venue.lng, event.venue.lat]
        // })) : this.state.bounds,
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

  onLocationClick() {
    this.setState({
      isLoading: true
    }, () => {
      navigator.geolocation.getCurrentPosition((geoInfo) => {
        this.setState({
          // bounds in 1 mile radius
          bounds: this.getBoundsWithNMileRadius([geoInfo.coords.longitude, geoInfo.coords.latitude], 1),
          beacon: [geoInfo.coords.longitude, geoInfo.coords.latitude],
          isLoading: false,
          queueEventFetch: true
        });
        console.log(geoInfo.coords.longitude, geoInfo.coords.latitude);
        this.onSearch([geoInfo.coords.longitude, geoInfo.coords.latitude], true);
      });
    })
   
  }

  onFinishMove() {
    if (this.state.queueEventFetch) {
      this.setState({
        queueEventFetch: false
      }, () => {
        // do the deed
        this.fetchEvents(this.state.currentSearchLocale.id, this.state.currentSearchLocale.date);
      })
    }
    // check our state for if we need to do a fetch or not now
  }

  onMarkerClick(event) {
    if (event === null) {
      // clicked on map
      this.killEventPane();
    } else if ((this.state.activeEvent!==null && event.id === this.state.activeEvent.id)) {
      // clicked same event
      this.killEventPane();
    } else {
      // new event!
      this.setState({
        activeEvent: event,
        center: [event.venue.lng, event.venue.lat],
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

  onVizClose() {
    this.setState({
      audioPlaying: false,
      activeTrackEvent: null,
      activeTrackArtist: null,
      activeTrack: null
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

  fetchLocation(keywordOrCoords, latLng=false) {
    this.setState({
      menuLoadingMessage: true,
      menuErrorMessage: false
    })
    const endPoint = (!latLng) ? '/location/search/' + keywordOrCoords :  
    '/location/geo:' + [...keywordOrCoords].reverse().join(',');
    
    return fetch(endPoint).then((resp) => {
      this.setState({
        menuLoadingMessage: false,
      })
      return resp.json();
    }).then((localeData) => {
      if (localeData.error) {
        throw localeData.error;
      } else {
        console.log('do the thing with..', localeData);
        return localeData;
      }
    })
  }

  loadLocaleFromLocalStorage() {
    try{
      return JSON.parse(localStorage.venuelyLocale);
    } catch (e) {
      const defaultLocale = {
        coords: [-122.4255740378749, 37.78290732055243], // sf baby
        descriptor: '[Current Location]', 
        id: null,
        date: new Moment(Date.now()).format('MM-DD-YYYY')
      };
      localStorage.venuelyLocale = JSON.stringify(defaultLocale);
      return defaultLocale;
    }
  }
  saveLocaleToLocalStorage(changes) {
    localStorage.venuelyLocale =  JSON.stringify(Object.assign(this.loadLocaleFromLocalStorage(), changes));
  }

  onDateChange(date) {
    this.saveLocaleToLocalStorage({date});
    this.setState({
      currentSearchLocale: this.loadLocaleFromLocalStorage()
    })
  }
  
  onSearch(keywordOrCoords, latLng=false) {
    if (latLng===false && keywordOrCoords.trim() === '') {
      this.setState({
        menuErrorMessage: 'Location Lookup cannot be blank. :('
      });
    } else {
      console.log(keywordOrCoords, ' was searched for ');
      this.fetchLocation(keywordOrCoords, latLng).then((localeData) => {
        // save localStorage
        this.saveLocaleToLocalStorage({
          coords: (latLng) ? keywordOrCoords : [localeData.metroArea.lng, localeData.metroArea.lat],
          descriptor: (latLng) ? '[Current Location]' : localeData.name, 
          id: localeData.metroArea.id
        });
        // set state
        this.setState({
          menuErrorMessage: '',
          currentSearchLocale: this.loadLocaleFromLocalStorage(),
          bounds: (latLng) ? this.state.bounds : this.getBoundsWithNMileRadius([localeData.city.lng, localeData.city.lat], 3)
        }, () => {
        
        });
      }).catch((error) => {
        this.setState({
          menuLoadingMessage: false,
          menuErrorMessage: error
        })
      })
    }
  }


  
  render() {
    return (
      <SliderLayout leftOn={this.state.leftOn} rightOn={this.state.rightOn}>
        <LoadingScreen isLoading={this.state.isLoading} message={'Please Wait'}/>
        <Header 
          onMenuClick={this.onMenuClick.bind(this)}
          onLocationClick={this.onLocationClick.bind(this)}>Venuely &#9834;</Header>
        <LeftSlider>
          <MenuOptions 
            onSearch={this.onSearch.bind(this)}
            onDateChange={this.onDateChange.bind(this)}
            loadingMessage={this.state.menuLoadingMessage}
            errorMessage={this.state.menuErrorMessage}
            currentSearchLocale={this.state.currentSearchLocale}
          />
        </LeftSlider>
        <MainContent leftOn={this.state.leftOn} rightOn={this.state.rightOn}>
          <MapView 
            center={this.state.center}
            bounds={this.state.bounds}
            beacon={this.state.beacon}
            onMarkerClick={this.onMarkerClick} 
            onFinishMove={this.onFinishMove.bind(this)}
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
            analysisBars={this.state.musicAnalysisBars}
            onSongClick={this.onPlayPauseWidget.bind(this)}
            onClose={this.onVizClose.bind(this)}
          />
          < SliderArea

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