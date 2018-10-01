require('dotenv').config();
const express = require('express');
const songKickHelper = require('./lib/songKickHelper');

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
  next();
});


app.get('/events', (req, res) => {
  console.log('hi')
  songKickHelper.fetchEvents('london', 'today', 'tomorrow').then((events) => {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(events));
  }).catch((error) => {
    res.throwError(500, error);
  });
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('listening on port ',port);
});