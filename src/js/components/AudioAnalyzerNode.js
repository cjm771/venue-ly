import React from 'react';
import {AudioAnalyzer} from '../lib/AudioAnalyzer';

export class AudioAnalyzerNode extends React.Component{
  
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.play && this.props.url) {
      this.aa = new AudioAnalyzer(this.props.url, () => {
        // if we get an onready
        if (this.props.onReady) {
          this.props.onReady(this.aa);
        }
        this.handlePlayPause();
       
      });
    }
  }

  handlePlayPause() {
    if (this.props.play == true) {
      this.aa.play();
      this.loop();
    } else {
      this.aa.pause();
    }
  }

  componentDidUpdate() {
    console.log('did update...',this.props.play);
    if (this.aa && this.aa.source) {
      this.handlePlayPause();
    }
  }

  componentWillUnmount() {
    if (this.aa) {
      this.aa.destroy();
    }
  }

  //analysis loop
  loop() { 
    requestAnimationFrame( () => {
      this.props.onAnalyze(this.aa.getLevel(), this.aa.getBars());
      if (this.aa.isPlaying) {
        this.loop(); //loop recursion
      } 
    });
  }

  // not used
  render() {
    return  (
    <div className='audioAnaylzerNode' style={{display:'none'}} data-play={this.props.play} data-url={this.props.url} >
    </div>
    )
  }

}