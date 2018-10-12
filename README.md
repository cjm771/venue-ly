Venue-ly
=========

Discover local music audibly + spatially!



Features
=========
  - find music from your current location (via [Songkick](http://songkick.com) api)
  - mapped lat lng on global map using [Mapbbox](http://mapbox.com)
  - clicking on events pane let you gain more insight into event, artist, and preview music! ([spotify](http://spotify.com) / [itunes](http://itunes.com) / [rovi](http://developer.rovicorp.com/docs) aggregated data)
  - bottom slider filters events only within specified range
  - menu pane lets you dial in specific days / change metro area
  - music playing is perstistant / music visualization (pin thumps // ftt bar animation / playback) utilizing another [audioAnalyzer.js](https://github.com/cjm771/AudioAnalyzer.js) 
  

Preview
=======
### Latest music in Oakland
  ![Basic](http://g.recordit.co/EcfIgmKnij.gif)

### Go to current location
  ![Current Location](http://g.recordit.co/ZYdk5g6ZtG.gif)

### Check out NYC / Change date with menu
  ![Change date](http://g.recordit.co/En7TxG9Nl3.gif)

Todo
=====
  - filter issues on refresh...check into?
  - mobile ready
  - genre display / filtering (only want hip hop? got you)
  - openers / headliners selection 
    - change artist preview , currently only shows headliner (but have the other info)
  - cache artists / events for n amount of time to prevent api call over-age
  - 'scan' mode --> randomly switch between events every 5 minutes like a radio and play a random song. 
  - deploy
  - 'Not [My_artist]?' - a way to find the actual artist if event artist doesn't match spotify / itunes findings



Build
======
Note:
For client source , before building make sure to copy `example.config.json` to `config.json` and supply an necessary tokens.