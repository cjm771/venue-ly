import React from 'react';
import css from '../../css/SliderLayout.css';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Header = (props) => (
  <div className='header'>
    <FontAwesomeIcon icon={faBars} className='menuIcon' onClick={props.onMenuClick} /><div className='headerText'>{props.children}</div>
  </div>
);

const SliderLayout = (props) => (
  <div className={`sliderLayout ${props.leftOn ? 'leftOn' : ''} ${props.rightOn ? 'rightOn' : ''}`}>
  {props.children}
  </div>
);
const MainContent = (props) => (
  <div className={`mainContent ${props.leftOn ? 'left' : ''} ${props.rightOn ? 'right' : ''}`}>
  {props.children}
  </div>
);

class Slider extends React.Component{
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.className}>
      <div className='sliderInner' style={this.props.innerStyle}>
      {this.props.children}
      </div>
      </div>
    )
  }
}

const LeftSlider = (props) => (
  <Slider className='leftSlider' on={props.on} innerStyle={{paddingTop: '60px'}}>
    {props.children}
  </Slider>
);

const RightSlider = (props) => (
  <Slider className='rightSlider' on={props.on} >
    {props.children}
  </Slider>
);

export {Header, SliderLayout, MainContent, LeftSlider, RightSlider};