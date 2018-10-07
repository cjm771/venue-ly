import React from 'react';
import TracksListItem from './TracksListItem';
import css from '../../css/TrackList.css';

const isPlaying = (soundPlaying, track, activeTrack) => {
  if (track && activeTrack) {
    return (soundPlaying && activeTrack.preview_url && track.preview_url === activeTrack.preview_url);
  }

} 

const TracksList = (props) => (
  <div className='tracksList'>
  {props.tracks.map((track, key) => {
    return (
      <TracksListItem 
        key={key}  
        something={'foobar'} 
        track={track}
        isPlaying={ isPlaying(props.soundPlaying, track, props.activeTrack) }
        onSongClick={props.onSongClick} 
      />
    )
  })}
  </div>
);

export default TracksList;