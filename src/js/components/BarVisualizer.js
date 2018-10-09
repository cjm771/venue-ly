import React from 'react';
import css from '../../css/BarVisualizer.css';

const BarVisualizer = ({bars}) => (
  !bars ? '' : (
  <div className='barVisualizer_wpr'>
    <div className='barVisualizer'> 
        {bars.map((barRatio, index) => {
          return (
            <div key={index} className='bar' style={{height: barRatio * 100 + '%'}}>
            </div>
          ) 
        })}
    </div>
  </div>
  )
);

export default BarVisualizer;