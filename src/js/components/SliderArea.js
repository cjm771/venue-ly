import React from 'react';
import { Range } from 'rc-slider';
import css from 'rc-slider/assets/index.css';
import css2 from '../../css/SliderArea.css';

const SliderArea = () => {
  return (
    <div className='sliderArea'>
      <div className='slider'>
        <Range 
          marks = {{0: '12:00am', 9: '9:00am', 23: 'Midnight'}}
          defaultValue={[9,23]}
          min={0}
          max={23}
        />
      </div>
    </div>
  );
};

export default SliderArea;