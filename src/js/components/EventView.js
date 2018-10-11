import React from 'react';
import css from '../../css/EventInfo.css';
import TracksList from './TracksList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin, faDrum } from '@fortawesome/free-solid-svg-icons';
import Moment from 'moment';

export default class EventView extends React.Component{
  constructor(props) {
    super(props);
  }


  render() {
    return (this.props.loading == true) ? 
      (<div className='loading'>Loading..</div>) : (
      <div className='eventInfo'>
        <div className='mainInfo_wpr'>
          <div className='artist_profile_img_wpr'> {
            (this.props.artist.image) ?
            (<img  className='artist_profile_img' src={this.props.artist.image} />) :
            (<div className='noImg' />)
          }
           
          </div>
          <div className='info_wpr'>
            <div  className='artist_name'>{this.props.artist.name}</div>
            <div  className='venue_name'>{this.props.event.venue.name}</div>
            <div  className='date'>
            {(this.props.event.starts_at) ? new Moment(this.props.event.starts_at).format('MMM DD, hh:mm A') : 'Time Unknown'}
            </div>
            <div  className='links'>
              <a href={this.props.artist.artist_url} target='_blank'><FontAwesomeIcon icon={faDrum} /> <span>About Artist</span></a> 
              <a href={this.props.event.url} target='_blank'><FontAwesomeIcon icon={faMapPin} /> <span>About Event</span></a>
            </div>
          </div>
          <div className='artist_bio_wpr'>
          <h3>Bio <span className='disclaimer'>Courtesy of Rivo</span></h3>
            <div className='artist_bio_content'>
            { (this.props.artist.description) ? 
            this.props.artist.description
            : (
            <i>No bio currently available.</i>
            )}
            </div>
            <div className ="read-more"></div>
          </div>
        </div>
        <TracksList 
          tracks={this.props.artist.topTracks} 
          activeTrack={this.props.activeTrack} 
          onSongClick={this.props.onSongClick}
          soundPlaying={this.props.soundPlaying}
        />
      </div>
    )
  }
}