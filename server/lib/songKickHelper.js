const fakeData = require('../data/sampleSongKickData.json');
const {retrieveDataViaMap} = require('./utils.js');

module.exports = {
  getDataFromSongKick: function(location, startTime, endTime) {

    return new Promise((resolve) => {
      resolve(fakeData);
    });
  },
  formatResults: function(results) {
    if (results.resultsPage && results.resultsPage.results && results.resultsPage.results.event) {
      debugger;
      return results.resultsPage.results.event.map( (event) => (retrieveDataViaMap(event, {
        name: 'displayName',
        type: 'type',
        url: 'url',
        venue: 'venue',
        starts_at: {att: 'start', format: (start) => {return start.datetime}},
        performers: { att: 'performance', 
          format: (performers) => {
            return performers.map((performer) => {
              return {
                name: performer.displayName,
                billing: performer.billing,
                billingIndex: performer.billingIndex,
                url: performer.artist.uri,
                id: performer.artist.id
              }
            });
            // return performers.map((performer) => {
            //   return retrieveDataViaMap(performer, {
            //     name: 'name',
            //     url: {att: 'artist', format: (artist) => {return artist.uri}},
            //     id: {att: 'artist', format: (artist) => {return artist.id}},
            //     billing: 'billing',
            //     billingIndex: 'billingIndex'
            //   });
            // });
          // }
        }}
      })));
    } else {
      throw "Results object does not have proper format! check  data source.";
    }
  },
  fetchEvents: function(location, startTime, endTime) {
    return this.getDataFromSongKick(location, startTime, endTime).then((results) => {
      return this.formatResults(results);
    })
  }
}