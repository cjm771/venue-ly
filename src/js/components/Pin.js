import React from 'react';
import css from '../../css/pin.css';

export default ({active}) => (
  <div style={{position: 'absolute'}} className='marker_wpr'>
    <div  className={`marker_scale_wpr ${active ? 'active' : ''}`}>
    <div  className='rotate_wpr'>
      <div className='pin'>
          <div className='notesWpr'>
            <div className='note bounce delayed'>&#9833;</div>
            <div className='note bounce'>&#9834;</div>
          </div>
        </div>
        <div className='pulse'></div>
      </div>
    </div>
  </div>
)