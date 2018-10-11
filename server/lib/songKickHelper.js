const fakeData = require('../data/songkick_events/san_francisco.json');
const  utils = require('./utils.js');
const url = require('url');
const Promise = require('bluebird');
const requestPromise = require('request-promise');

module.exports = {
  endpoint: 'https://api.songkick.com/api/3.0/',
  getDataFromSongKickFake: function(location, startTime, endTime) {

    return new Promise((resolve) => {
      resolve(fakeData);
    });
  },

  queryApi: function(apiName, queryParams={}) {
    params = new url.URLSearchParams();
    params.set('apikey', process.env.SONGKICK_ACCESS_TOKEN);
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== null) {
        params.set(key, queryParams[key]);
      }
    });
    const final_url = this.endpoint + apiName + '.json?' + params.toString();
    console.log(final_url);
    return requestPromise({
      url: final_url,
      gzip: true
    });
  },

  getLocationFromKeyword: function(keywordOrLocale, type='query') {
    return this.queryApi('search/locations', {
      query: (type === 'query') ? keywordOrLocale : null,
      location: (type === 'location') ? keywordOrLocale : null,
    }).then((results) => {
        let resultsObj = {};
        try {
           resultsObj = JSON.parse(results).resultsPage.results;

        } catch (e) {
          throw 'JSON Error occurred: ' + e
        }
        
        if ( resultsObj && resultsObj.location) {
          results = JSON.parse(results).resultsPage.results.location.filter(({city}) => {
            return city.lat && city.lng;
          });
          results[0].name=`${results[0].metroArea.displayName},${results[0].metroArea.state ? ' ' + 
          results[0].metroArea.state.displayName + ',' : ''} ${results[0].metroArea.country.displayName}`;
          return results[0];
        } else if (Object.keys(resultsObj).length === 0 ){
          throw 'Location could not be found.'
        } else {
          throw 'Unknown error with results: ' + JSON.stringify(resultsObj);
        }
    }).catch((err) => {
      throw  err;
    })
  },

  getDate: function(date=Date.now(), addedDays=0) {
    debugger;
    const timestamp =  date + addedDays * (1000*60*60*24);
    return new Date(timestamp).toISOString().split('T')[0];
  },

  utf8_to_str: function(a) {
    for(var i=0, s=''; i<a.length; i++) {
        var h = a[i].toString(16)
        if(h.length < 2) h = '0' + h
        s += '%' + h
    }
    return decodeURIComponent(s)
  },

  getDataFromSongKick: function(location, startTime=this.getDate(), endTime=this.getDate()) {
    return this.queryApi('events', {
      min_date: startTime,
      max_date: endTime,
      location: 'sk:' + location
    }).then((results) => {
      // return this.utf8_to_str(results);
      // return results;
      return JSON.parse(results)
    })
  },


  formatResults: function(results) {
    if (results.resultsPage && results.resultsPage.results && results.resultsPage.results.event) {
      return results.resultsPage.results.event.map( (event) => (utils.retrieveDataViaMap(event, {
        id: 'id',
        name: 'displayName',
        type: 'type',
        url: 'uri',
        venue:  {att: 'venue', format: (venue) => {
          venue.name = venue.displayName;
          return venue;
        }},
        starts_at: 'start.datetime',
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
        }}
      })));
    } else {
      throw "Results object does not have proper format! check  data source.";
    }
  },
  fetchEvents: function(location, startTime, endTime) {
    return this.getDataFromSongKickFake(location, startTime, endTime).then((results) => {
      return this.formatResults(results);
    })
  }
}