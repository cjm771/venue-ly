import React from 'react';
import PlayButton from './PlayButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { faSpotify, faItunes} from '@fortawesome/free-brands-svg-icons';

const getProvider = (type) => {
  switch (type) {
    case 'spotify':
      return faSpotify;
    case 'itunes':
      return faItunes;
    default:
      return faMusic;
  }
}

const handlePlaybackClick = (clickedTrack, isPlaying, callback) => {
  callback(clickedTrack, isPlaying);
}

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
              <FontAwesomeIcon className='provider' icon={getProvider(track.type)}/>
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