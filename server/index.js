require('dotenv').config();
const express = require('express');
const songKickHelper = require('./lib/songKickHelper');
const spotifyHelper = require('./lib/spotifyHelper');
const itunesHelper = require('./lib/itunesHelper');

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
        return itunesHelper.fetchArtistsTopTracksFake(artist.name).then((itunesResults) => {
          artist.topTracks = artist.topTracks.concat(itunesResults);
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