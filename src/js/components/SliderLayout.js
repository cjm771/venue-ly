import React from 'react';
import css from '../../css/SliderLayout.css';
import { faBars, faSearchLocation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from './Loading';

const Header = (props) => (
  <div className='header'>
    <FontAwesomeIcon icon={faBars} className='menuIcon icon' onClick={props.onMenuClick} />
    <div className='headerText'>
      {props.children}
      </div>
      <div className='locationIcon'> 
      <FontAwesomeIcon className='icon' onClick={props.onLocationClick} icon={faSearchLocation} />
      </div>
  </div>
);

const SliderLayout = (props) => (
  <div className={`sliderLayout ${props.leftOn ? 'leftOn' : ''} ${props.rightOn ? 'rightOn' : ''}`}>
  {props.children}
  </div>
);
const MainContent = (props) => (
  <div className={`mainContent ${props.leftOn ? 'left' : ''} ${props.rightOn ? 'right' : 'right'}`}>
  {props.children}
  </div>
);

const LoadingScreen = (props) => (
  props.isLoading ? (
  <div className='loadingSplash'>
    <div className='loadingMain'>
      <Loading />
      {props.message}
    </div>
  </div> ) :
  ''
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
  <Slider className='leftSlider' on={props.on} innerStyle={{paddingTop: '100px'}}>
    {props.children}
  </Slider>
);

const RightSlider = (props) => (
  <Slider className='rightSlider' on={props.on} >
    {props.children}
  </Slider>
);

export {Header, SliderLayout, MainContent, LeftSlider, RightSlider, LoadingScreen};