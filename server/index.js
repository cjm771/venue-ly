require('dotenv').config();
const express = require('express');
const songKickHelper = require('./lib/songKickHelper');
const spotifyHelper = require('./lib/spotifyHelper');
const itunesHelper = require('./lib/itunesHelper');
const roviHelper = require('./lib/roviHelper');
const utils = require('./lib/utils');

const app = new express();

app.use('/', express.static('dist/'));


// echo request
const echoRequest = (req, res, next) => {
  console.log(`${req.method} Request on ${req.url}`);
  next();
}
app.use(echoRequest);

// some response helpers
app.use((req, res, next) => {
  
  res.throwError = function(status, error) {
    this.status(status);
    this.end(JSON.stringify({error: error}));
    console.log('Error!', error);
  }

  res.throwSuccess = function(data, status=200) {
    this.status(status);
    this.end(JSON.stringify(data));
  }
  next();
});


// minght not need
// app.get('/tracks/:trackIds', (req, res) => {
//   spotifyHelper.fetchTracksByIdsFake(req.params.trackIds.split(',').map((trackId) => {
//   return trackId.trim(); 
//   }).filter((trackId) => {
//     return trackId !== ''
//   })).then((results) => {
//     res.throwSuccess(results);
//   }).catch((error) => {
//     res.throwError(500, error);
//   });
// });


// might not need
// app.get('/artistsInfo/:artistIds', (req, res) => {
//   console.log('oh hai..');
//   debugger;
//   spotifyHelper.fetchArtistsByIds(req.params.artistIds.split(',').map((artistId) => {
//   return artistId.trim(); 
//   }).filter((artistId) => {
//     return artistId !== ''
//   })).then((results) => {
//     res.throwSuccess(results);
//   }).catch((error) => {
//     res.throwError(500, error);
//   });
// });

// all artists
app.get('/topTracks/:artist', (req, res) => {
  // fetchArtists is real one
  spotifyHelper.fetchArtistsFake(req.params.artist).then((results) => {
    // return 1st artist if one else, return empty
    if (results.length > 0) {
      const bestMatch = results[0];
      bestMatch.otherArtists = results.slice(1);
      return results[0];
    } else {
      return false
    }
  }).then((artist) => {
    if (artist) {
      // ok lets try getting the top tracks for the first artist in both spotify and itunes
      return spotifyHelper.fetchTopSongsByArtistIdFake(artist.id).then((spotifyTracks) => {
        artist.topTracks = spotifyTracks;
        return artist;
      }).then((artist) => {
        // lets get the rovi bio if there is one
        return roviHelper.fetchArtistsBios(artist.name).then((roviBio) => {
          if (roviBio && roviBio.bio && roviBio.bio!='') {
            artist.description = roviBio.bio;
          }
          return artist;
        })
      }).then((artist) => {
        return itunesHelper.fetchArtistsTopTracksFake(artist.name).then((itunesResults) => {
          if (Array.isArray(itunesResults) > 0) {
            // util to handle two data sources + merge them
            artist.topTracks = utils.mergePruneFilter(artist.topTracks, itunesResults, {
              beforeStart: (arr) => {
                // grab name + remove parenthesis
                return arr.map((track) => {
                  track['modified_title'] = track['title'].replace(/\((.+)\)/g, '').trim();
                  return track;
                });
              },
              mergeOn: 'modified_title',
              attsToCopy: ['preview_url', 'track_url'],
              filter: (obj) => {
                return (obj.preview_url);
              },
              pruneDuplicates: true, 
              beforeFinish: (filteredArr, unfilteredArr) => {
                // make sure theyre's @ least 5
                const amountToHave = 5;
                filteredArr = filteredArr.slice(0, 5)
                if (filteredArr.length !== amountToHave) {
                  filteredArr = filteredArr.concat(unfilteredArr.slice(0, 
                    amountToHave - filteredArr.length));
                  
                }
                return filteredArr;
              }
            })
          }
    
          return res.throwSuccess(artist);
        })
      }).catch((error) => {
        res.throwError(500, error);
      });
  
    } else {
      return res.throwSuccess(artist);
    }
  }).catch((error) => {
    res.throwError(500, error);
  });
});

// rovi artists bios
app.get('/roviBios/:artist', (req, res) => {
  // fetchTopSongsByArtistId is real one
  roviHelper.fetchArtistsBiosFake(req.params.artist).then((results) => {
    res.throwSuccess(results);
  }).catch((error) => {
    res.throwError(500, error);
  });
})


// spotify artists
app.get('/topSpotifyTracks/:artistId', (req, res) => {
  // fetchTopSongsByArtistId is real one
  spotifyHelper.fetchTopSongsByArtistIdFake(req.params.artistId).then((results) => {
    res.throwSuccess(results);
  }).catch((error) => {
    res.throwError(500, error);
  });
})

//itunes artists
app.get('/topItunesTracks/:artist', (req, res) => {
  // fetchArtists is real one
  itunesHelper.fetchArtistsTopTracksFake(req.params.artist).then((results) => {
    res.throwSuccess(results);
  }).catch((error) => {
    res.throwError(500, error);
  });
});


app.get('/artists/:artist', (req, res) => {
  // fetchArtists is real one
  spotifyHelper.fetchArtistsFake(req.params.artist).then((results) => {
    res.throwSuccess(results);
  }).catch((error) => {
    res.throwError(500, error);
  });
});

app.get('/events', (req, res) => {
  songKickHelper.fetchEvents('london', 'today', 'tomorrow').then((events) => {
    res.throwSuccess(events);
  }).catch((error) => {
    res.throwError(500, error);
  });
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('listening on port ',port);
});