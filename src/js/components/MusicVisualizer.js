import React from 'react';
import css from '../../css/MusicVisualizer.css';
import PlayButton from './PlayButton';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {getProviderIcon, handlePlaybackClick} from '../lib/utils';

const MusicVisualizer = ({event, track, artist, isPlaying, onSongClick}) => {
  return (event!==null && track!==null && artist!==null) ? (
  <div className='musicVisualizer_wpr' >
  <div className='left'>
    <PlayButton isPlaying={isPlaying} onClick={(e) => {
      handlePlaybackClick(track, isPlaying, onSongClick)
      }
    } />
    </div>
  <div className='right'>
      <div className='songTitle'> 
        <FontAwesomeIcon className='provider' icon={getProviderIcon(track.type)}/>
        <a href={track.track_url} target='_blank'>{track.title}</a> 
      </div>
      <div className='artistName'>{artist.name} @ {event.venue.name}</div>
    </div>
  </div>
  ) : (
    ''
  )
};


export default MusicVisualizer;