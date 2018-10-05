const fs = require('fs');
const Promise = require('bluebird');
const requestPromise = require('request-promise');
const utils = require('./utils.js');
const md5Hex = require('md5-hex');

const ROVI_API_KEY = process.env.ROVI_API_KEY;
const ROVI_API_SECRET = process.env.ROVI_API_SECRET;
 
module.exports = {

  genSig: function() {
      var gmtstring = new Date().toGMTString();
      var utc = Date.parse(gmtstring) / 1000;
      return md5Hex(ROVI_API_KEY + ROVI_API_SECRET + utc);
  },
  fetchArtistsBiosFake: function(keyword) {
    return Promise.promisify(fs.readFile)(__dirname + '/../data/rovi_artistBios/' + keyword.replace(/ /g, '_') + '.json').then((contents) => {
      return JSON.parse(contents);
    }).then(results => {
      return this.sanitizeBios(results);
    });
  },
  sanitizeBios: function(rawResp) {
    return utils.retrieveDataViaMap(rawResp, {
      'artist': 'parameters.id',
      'bio': {att: 'musicBio.text', format: (v) => {
        return v.replace(/\[roviLink=.+?\](.+?)\[\/roviLink\]/g, '$1');
      }}
    });
  },
  fetchArtistsBios: function(artist) {
    return requestPromise(`http://api.rovicorp.com/data/v1.1/name/musicbio?name=${artist}` + 
    `&country=US&language=English&format=json&` + 
    `apikey=${ROVI_API_KEY}&` +
    `sig=${this.genSig()}`).then((text) => {
      return JSON.parse(text);
    }).then(results => {
      return this.sanitizeBios(results);
    });
  }
}