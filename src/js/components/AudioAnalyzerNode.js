import React from 'react';
import {AudioAnalyzer} from '../lib/AudioAnalyzer';

export class AudioAnalyzerNode extends React.Component{
  
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.play && this.props.url) {
      this.handlePlayPause();
    }
  }

  destroyIfExists() {
    if (this.aa && this.aa.source) {
      this.aa.destroy();
    }
  }

  handlePlayPause() {
    if (this.props.play == true) {
      this.destroyIfExists();
      this.aa = new AudioAnalyzer(this.props.url, () => {
        // if we get an onready
        if (this.props.onReady) {
          this.props.onReady(this.aa);
        }
        // play the dang thing
        this.aa.play();
        // start analysis loop
        this.loop();
      });
    
    } else {
      this.destroyIfExists();
    }
  }

  propsChanged(prevProps) {
    const toCheck = ['url', 'play'];
    return toCheck.reduce((key) => {
      prevProps[key] === this.props.key
    }).length !== 0
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.propsChanged) {
      this.handlePlayPause();
    }
  }

  componentWillUnmount() {
    this.destroyIfExists();
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