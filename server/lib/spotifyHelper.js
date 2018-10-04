const fs = require('fs');
const Promise = require('bluebird');

// const fakeData = require('../data/spotify.json');
const {retrieveDataViaMap} = require('./utils.js');
const SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

module.exports = {
  refreshTokenTime: 3600-500,
  token: {
    expires: 0,
    value: null
  },
  fetchAccessToken: function() {
    if (this.token.value === null || this.token.expires < Date.now() - refreshTokenTime) {
      return spotifyApi.clientCredentialsGrant().then(
        function(data) {
          console.log('The access token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);
          spotifyApi.setAccessToken(data.body['access_token']);
          return data.body['access_token'];
        },
        function(err) {
          console.log('Something went wrong!', err);
        }
      );
    } else {
      return new Promise((resolve) => {
        spotifyApi.setAccessToken(this.token.value);
        resolve(this.token.value);
      });
    }
  },

  // fetchTracksByIdsFake: function(trackIds) {
  //   if (!Array.isArray(trackIds)) {
  //     trackIds = [trackIds];
  //   }
  //   return Promise.promisify(fs.readFile)(__dirname + '/../data/tracks/' + trackIds + '.json').then((contents) => {
  //     return JSON.parse(contents);
  //   });
  // },

  // fetchTracksByIds: function(trackIds) {
  //   if (!Array.isArray(trackIds)) {
  //     trackIds = [trackIds];
  //   }
  //   return this.fetchAccessToken().then( () => {
  //     // Get multiple artists
  //     return spotifyApi.getTracks(trackIds, 'US');
  //   });
  // },
  // fetchArtistsByIds: function(artistIds) {
  //   if (!Array.isArray(artistIds)) {
  //     artistIds = [artistIds];
  //   }
  //   return this.fetchAccessToken().then( () => {
  //     // Get multiple artists
  //     return spotifyApi.getArtists(artistIds);
  //   });
  // },
  fetchTopSongsByArtistIdFake: function(artistId) {
    return Promise.promisify(fs.readFile)(__dirname + '/../data/top_tracks/' + artistId + '.json').then((contents) => {
      return JSON.parse(contents);
    });
  },
  fetchTopSongsByArtistId: function(artistId) {
    return this.fetchAccessToken().then( () => {
      return spotifyApi.getArtistTopTracks(artistId, 'US');
    });
  },
  fetchArtistsFake: function(keyword) {
    return Promise.promisify(fs.readFile)(__dirname + '/../data/spotify_artists/' + keyword.replace(/ /g, '_') + '.json').then((contents) => {
      return JSON.parse(contents);
    });
  },
  fetchArtists: function(keyword) {
    // Search artists whose name contains 'keyword'
    return this.fetchAccessToken().then( () => {
      return spotifyApi.searchArtists(keyword);
    });
  }
};

