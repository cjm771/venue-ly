import React from 'react';
import css from '../../css/MusicVisualizer.css';
import PlayButton from './PlayButton';
import BarVisualizer from './BarVisualizer';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {getProviderIcon, handlePlaybackClick} from '../lib/utils';

const MusicVisualizer = ({event, track, artist, isPlaying, onSongClick, onClose, analysisBars}) => {
  return (event!==null && track!==null && artist!==null) ? (
  <div className='musicVisualizer_wpr' >
  <div className='left'>
  
    <PlayButton isPlaying={isPlaying} onClick={(e) => {
      handlePlaybackClick(track, isPlaying, onSongClick)
      }
    } />
    </div>
  <div className='right' style={isPlaying ? {} : {width: '72%'} }>
      <div className='songTitle'> 
        <FontAwesomeIcon className='provider' icon={getProviderIcon(track.type)}/>
        <a href={track.track_url} target='_blank'>{track.title}</a> 
      </div>
      <div className='artistName'>{artist.name} @ {event.venue.name}</div>
      
      <div className='close icon' onClick={onClose}>
        <FontAwesomeIcon  icon={faTimesCircle} />
      </div>
    </div>
    <div className='rightMore' style={isPlaying ? {} : {width: '1%'} }>
    <BarVisualizer bars={!isPlaying ? null : analysisBars} />
    </div>
  </div>
  ) : (
    ''
  )
};


export default MusicVisualizer;