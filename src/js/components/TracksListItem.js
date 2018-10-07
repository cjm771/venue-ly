import React from 'react';
import PlayButton from './PlayButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {getProviderIcon, handlePlaybackClick} from '../lib/utils';

const TracksListItem = ({track, onSongClick, isPlaying}) => (
  <div className='trackItem'>
    <div className='left'>
      
      <div className='songPlayer_wpr' >
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
            <div className='albumName'>{track.album}</div>
          </div>
      </div>

    </div>
    <div className='right'>
      <img src={track.image} />
    </div>
        
  </div>
);

export default TracksListItem;