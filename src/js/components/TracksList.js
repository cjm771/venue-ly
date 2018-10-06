import React from 'react';
import TracksListItem from './TracksListItem';
import css from '../../css/TrackList.css';

const TracksList = (props) => (
  <div className='tracksList'>
  {props.tracks.map((track, key) => {
    return (
      <TracksListItem 
        key={key}  
        something={'foobar'} 
        track={track}
        isPlaying={ track === props.activeTrack }
        onSongClick={props.onSongClick} 
      />
    )
  })}
  </div>
);

export default TracksList;