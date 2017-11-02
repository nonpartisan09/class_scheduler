import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './DoubleSlider.css';

function convertStepsToTime(value, divider) {
  if (_.isNumber(value) && _.isNumber(divider)) {
    const time = _.toString((value/divider)).split('.');
    const hour = time[0];
    const minutes = time[1]? _.round((time[1]%60), 2) : 0 ;
    const readableMinutes = minutes >= 10? minutes : '0' + minutes;

    return `${hour}:${readableMinutes || '00' }`;
  } else {
    return null;
  }
}

function absoluteValue(value) {
  if(_.isNumber(value)) {
    const slider = document.getElementById('slider');
    const sliderOffset = slider.offsetLeft;

    return value - sliderOffset;
  }
}

class DoubleSlider extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleDragFirstSlider = this.handleDragFirstSlider.bind(this);
    this.handleDragEndFirstSlider = this.handleDragEndFirstSlider.bind(this);
    this.handleDragSecondSlider = this.handleDragSecondSlider.bind(this);
    this.handleDragEndSecondSlider = this.handleDragEndSecondSlider.bind(this);
  }

  render() {
    const { width, firstSlider, secondSlider } = this.props;

    const minTime = convertStepsToTime(firstSlider, this.numberOfSteps());
    const maxTime = convertStepsToTime(secondSlider, this.numberOfSteps());

    return (
      <div id='slider' style={ { width: width + 'px' } }>
        <div className='sliderRange'>
          { `Filter by time: ${minTime} - ${maxTime}` }
        </div>

        <div className='sliderBar' >
          <div
            title='start'
            style={ { left: firstSlider + 'px' } }
            draggable
            className='sliderButton'
            onDrag={ this.handleDragFirstSlider }
            onDragEnd={ this.handleDragEndFirstSlider }
          >
            <input className='sliderFirstInput' defaultValue={ firstSlider } />
          </div>

          <div
            title='end'
            style={ { left: secondSlider + 'px', position: 'absolute' } }
            draggable
            className='sliderButton'
            onDrag={ this.handleDragSecondSlider }
            onDragEnd={ this.handleDragEndSecondSlider }

          >
            <input className='sliderSecondInput' defaultValue={ secondSlider }  />
          </div>

          <div className='sliderProgressBar' style={ { width: (secondSlider-firstSlider-15) + 'px', left: (firstSlider+15)+'px' } } />
        </div>
      </div>
    );
  }

  handleDragFirstSlider(event) {
    const { width, secondSlider, onClickFirstSlider } = this.props;

    const newValue = absoluteValue(event.pageX);

    if (secondSlider > newValue && newValue > 0 && newValue < width) {
      onClickFirstSlider(newValue);
    } else if (newValue < 0) {
      onClickFirstSlider(0);
    } else {
      onClickFirstSlider(secondSlider - 15);
    }
  }

  handleDragEndFirstSlider(event) {
    const { width, secondSlider, onClickFirstSlider } = this.props;

    const newValue = absoluteValue(event.pageX);

    if (secondSlider > newValue && newValue > 0 && newValue < width) {
      onClickFirstSlider(newValue);
    } else if (newValue < 0) {
      onClickFirstSlider(0);
    } else {
      onClickFirstSlider(secondSlider - 15);
    }
  }

  handleDragSecondSlider(event) {
    const { width, firstSlider, onClickSecondSlider } = this.props;

    const newValue = absoluteValue(event.pageX);

    if (firstSlider < newValue && newValue > 0 && newValue < width) {
      onClickSecondSlider(newValue);
    } else if (newValue > width) {
      onClickSecondSlider(width - 15)
    } else {
      onClickSecondSlider(firstSlider + 15);
    }
  }

  handleDragEndSecondSlider(event) {
    const { width, firstSlider, onClickSecondSlider } = this.props;

    const newValue = absoluteValue(event.pageX);

    if (firstSlider < newValue && newValue > 0 && newValue < width) {
      onClickSecondSlider(newValue);
    } else if (newValue > width) {
        onClickSecondSlider(width - 15)
    } else {
      onClickSecondSlider(firstSlider + 15);
    }
  }

  numberOfSteps() {
    const { maxValue, width } = this.props;

    return (width-15)/maxValue;
  }

  moveBySteps() {
    const { maxValue, steps } = this.props;

    return _.round(this.numberOfSteps() * (maxValue*steps), 2);
  }
}

DoubleSlider.propTypes = {
  maxValue: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  steps: PropTypes.number.isRequired,
  firstSlider: PropTypes.number.isRequired,
  secondSlider: PropTypes.number.isRequired,
  onClickFirstSlider: PropTypes.func.isRequired,
  onClickSecondSlider: PropTypes.func.isRequired,
};

DoubleSlider.defaultProps = {

};

export default DoubleSlider;
