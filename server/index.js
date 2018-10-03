require('dotenv').config();
const express = require('express');
const songKickHelper = require('./lib/songKickHelper');
const spotifyHelper = require('./lib/spotifyHelper');

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
    this.end(JSON.stringify(error));
    console.log('Error!', error);
  }

  res.throwSuccess = function(data, status=200) {
    this.status(status);
    this.end(JSON.stringify(data));
  }
  next();
});

app.get('/topTracks/:artistId', (req, res) => {
  // fetchTopSongsByArtistId is real one
  spotifyHelper.fetchTopSongsByArtistIdFake(req.params.artistId).then((results) => {
    res.throwSuccess(results);
  }).catch((error) => {
    res.throwError(500, error);
  });
})

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