import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import css from '../../css/playButton.css';

const PlayButton = (props) => (
  <div className='playButton' onClick={props.onClick}>
    <FontAwesomeIcon icon={(props.isPlaying ? faPause : faPlay)} />
  </div>
);

export default PlayButton;