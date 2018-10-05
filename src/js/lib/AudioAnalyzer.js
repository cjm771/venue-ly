/***********
Audio Analyzer
***********/
/*
 * Grab a CORS ready http mp3 and analyze/stream away: new AudioAnalyzer('http://myawesome.com/cool.mp3', func);
 * Web audio html tag (careful DOM issues in chrome): new AudioAnalyzer('#el', func);
 * Mic (in beta..): run aa.startMic();
 * 
 * 
 * aa.pause(), aa.play(), aa.isPlaying for playback
 * 
 * Analysis
 * ----------
 * then run a loop or whatever and call aa.getLevel(), returns # from 0 --> 1
 * for Mic (in beta.): run aa.getMicLevel();
 * Copyright Chris Malcolm, 2018

 *
 */


var AudioAnalyzer = function(elOrUrl, onReady) {
  this.currentPosition = 0;
  this.isPlaying = false;
  this.isMicOn = false;
  this.audioCtx = new AudioContext();
  this.desiredFFT = 32;

  this.analyser = this.createAnalyser(this.desiredFFT);
  this.analyserIn =  this.createAnalyser(this.desiredFFT);
  this.source = false; //out
  this.input = false; //mic
  var notASelector = false;
  try{
    $(elOrUrl);
  } catch (e) {
    notASelector = true;
  }
  if (notASelector || $(elOrUrl).length === 0) {
    this.loadFromUrl(elOrUrl, onReady);
    this.url = elOrUrl; // mp3 link
  } else {
    this.loadFromEl(elOrUrl, onReady);
    this.el = elOrUrl; // audio thing
  }
}

//get level average
AudioAnalyzer.prototype.getLevel = function(analyzer) {
  analyzer = analyzer || this.analyser;
  var fftArr = this.fft(analyzer); 
  //get average from 0 --> 1
  var count = 0;
  var normalizedLevel = fftArr.reduce(function(acc, current) {
    if (current !== 0) {
      count++;
    }
    acc += current;
    return acc;
  })/(255*count);
  return normalizedLevel;
}

//get level average
AudioAnalyzer.prototype.getBars = function(analyzer) {
  analyzer = analyzer || this.analyser;
  var fftArr = this.fft(analyzer); 
  //get average from 0 --> 1
  var count = 0;
  return [...fftArr].map(function(item) {
    return item/255;
  });
}

AudioAnalyzer.prototype.getMicLevel = function() {
  return this.getLevel(this.analyserIn);
}



AudioAnalyzer.prototype.createAnalyser = function(fftSize) {
  var a = this.audioCtx.createAnalyser();
  a.fftSize = fftSize;
  return a;
}

//will return the arr of frequency bin
AudioAnalyzer.prototype.fft = function(analyzer) {
  var frequencyData = new Uint8Array(analyzer.frequencyBinCount);
  analyzer.getByteFrequencyData(frequencyData);
  return frequencyData;
}

//start mic..
AudioAnalyzer.prototype.startMic = function() {
  var that = this;
  this.isMicOn = true;
  navigator.getUserMedia({ audio: true }, processSound, function(e) { console.log('error occurred when initializing mic:', e)});
  function processSound (stream) {
    that.analyserIn.smoothingTimeConstant = 0.85;
    that.input = that.audioCtx.createMediaStreamSource(stream);
    that.input.connect(that.analyserIn);
    // that.analyserIn.connect(that.audioCtx.destination);
  }
}

AudioAnalyzer.prototype.stopMic = function() {
  this.isMicOn = false;
  if (this.analyserIn) {
    this.input.disconnect(this.analyserIn);
    this.input = null;
  }
}

AudioAnalyzer.prototype.destroy = function() {
  this.pause();
  this.source.disconnect(this.analyzer);
  this.source.disconnect(this.audioCtx.destination);
  this.audioCtx.close();
}


AudioAnalyzer.prototype.pause = function() {
  this.isPlaying = false;
  console.log('pausing..');
  this.source.stop(0);
  this.resetSource(this.buffer);
}

AudioAnalyzer.prototype.play = function() {
  this.isPlaying = true;
  console.log('playing..');
  this.source.start(0);
}

AudioAnalyzer.prototype.resetSource = function(buffer) {
  this.source = this.audioCtx.createBufferSource();
  this.source.buffer = buffer;
  this.source.connect(this.analyser);
  this.source.connect(this.audioCtx.destination);
  this.source.loop = true;
}

AudioAnalyzer.prototype.loadFromUrl = function(url, onReady) {
    var that = this;

    var request = new XMLHttpRequest();
    request.open('GET', url , true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
      var audioData = request.response;
      that.audioCtx.decodeAudioData(audioData, function(buffer) {
        that.buffer = buffer;
        that.resetSource(that.buffer);
        if (onReady !== undefined) {
          onReady.call(that);
        }
      },
        function(e){ 
          console.log("Error with decoding audio data" + e.err); 
      });
  
    }
  
    request.send();
  
}

AudioAnalyzer.prototype.loadFromEl = function(el, onReady) {
  var that = this;
  console.log('woop woop', this);
  $(el).bind('onProgress', function() {
    console.log("progress is occurring..", e);
  });
  $(el).bind('canplaythrough', function() {
    console.log('ehh?', el, onReady);
    $('#play').trigger('click');
    var elDom = $(el)[0];
		this.source = that.audioCtx.createMediaElementSource(elDom);
		this.source.connect(that.analyser);
		that.analyser.connect(that.audioCtx.destination);
    if (onReady !== undefined) {
      onReady.call(that);
    }
	});
	
}

export {AudioAnalyzer};