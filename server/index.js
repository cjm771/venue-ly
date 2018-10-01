require('dotenv').config();
const express = require('express');
const app = new express();
app.use('/', express.static('dist/'));

app.get('/gettoken', (req, res) => {
  res.writeHead(200, null, {
    'Content-Type': 'text/plain'
  });
  res.end(process.env.MAPBOX_ACCESSTOKEN);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('listening on port ',port);
});