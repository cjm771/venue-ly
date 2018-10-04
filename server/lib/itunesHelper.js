const fs = require('fs');
const Promise = require('bluebird');
const requestPromise = require('request-promise');

const opts = {
    query: {
        entity: 'musicArtist',
        limit: 5
    }
};
 

module.exports = {
  fetchArtistsTopTracksFake: function(keyword) {
    return Promise.promisify(fs.readFile)(__dirname + '/../data/itunes_topTracksBy/' + keyword.replace(/ /g, '_') + '.json').then((contents) => {
      return JSON.parse(contents);
    });
  },
  fetchArtistsTopTracks: function(artist) {
    return requestPromise(`https://itunes.apple.com/search?term=${artist}&limit=5&entity=song`).then((text) => {
      return JSON.parse(text);
    });
  }
}