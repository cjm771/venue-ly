const fs = require('fs');
const Promise = require('bluebird');
const requestPromise = require('request-promise');
const utils = require('./utils.js');

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
    }).then(({results: rawTracks}) => {
      return this.sanitizeTracks(rawTracks);
    });
  },
  sanitizeTracks: function(rawTracks) {
    return rawTracks.map((track) => {
      debugger;
      return utils.retrieveDataViaMap(track, {
        'title' :  'trackName',
        'album': 'collectionName',
        'id' :  '1274153124',
        'type' : {val: 'itunes'},
        'image' : 'artworkUrl100',
        'track_url' : 'trackViewUrl',
        'preview_url': 'previewUrl',
        'description': ''
      });
    });
  },
  fetchArtistsTopTracks: function(artist) {
    return requestPromise(`https://itunes.apple.com/search?term=${artist}&limit=5&entity=song`).then((text) => {
      return JSON.parse(text);
    }).then(({results: rawTracks}) => {
      return this.sanitizeTracks(rawTracks);
    });
  }
}