import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import css from '../../css/MenuOptions.css';

import Moment from 'moment';

export class MenuOptions extends React.Component{



  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      searchDate: Moment(Date.now())
    };
  }

  onDateChange(moment) {
    this.props.onDateChange(moment.format('MM/DD/YYYY'));
  }


  handleInputChange(e) {
    this.setState({
      keyword: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    // TODO : validate search date input..
    this.props.onSearch(this.state.keyword);
    this.setState({
      keyword: ''
    });
  }
  

  render() {
    return (
      <div className='menu'>
        {(this.props.loadingMessage) ? (
            <div className='loadingBox'>
            Loading.. Please Wait...
            </div>
        ) : (
          ''
        )}
        {(this.props.errorMessage) ? (
            <div className='errorBox'>
            {typeof this.props.errorMessage === 'string' ? this.props.errorMessage : JSON.stringify(this.props.errorMessage)}
            </div>
        ) : (
          ''
        )}
        <h3>Currently Searching:</h3>
        <div className='input_wpr'>
        <span className='currentSearchLocale'>{this.props.currentSearchLocale.descriptor}</span>
        </div>
         <h3>Date</h3>
        <div className='input_wpr'>
          <DatePicker
              selected={new Moment(this.props.currentSearchLocale.date)}
              onChange={this.onDateChange.bind(this)}
          />
        </div>
        <h3>Change Location</h3>
        <form onSubmit={this.handleSubmit.bind(this)} >
        <div className='input_wpr'>
          <div className='searchLocation_wpr'>
            <input type='text' placeholder='ex. San Francisco, CA' 
            value={this.state.keyword} onChange={this.handleInputChange.bind(this)} className='searchLocation' />
          </div>
          <input type='submit' className='searchButton' value='Change' />
        </div>
        </form>
      </div>
    )
  }
}