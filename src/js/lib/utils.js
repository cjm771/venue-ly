import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { faSpotify, faItunes} from '@fortawesome/free-brands-svg-icons';

const getProviderIcon = (type) => {
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

export {
  getProviderIcon, handlePlaybackClick
};