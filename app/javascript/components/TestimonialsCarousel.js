import React, { Component } from 'react';
import {
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
} from '@material-ui/core';
import PropTypes from 'prop-types';

class TestimonialsCarousel extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            activeStep: 0,
        };
    }
    
    handleNext = () => {
      this.setState(prevState => {
         return { activeStep: prevState.activeStep + 1 };
      });
    }
    
    handleBack = () => {
      this.setState(prevState => {
         return { activeStep: prevState.activeStep - 1 };
      });
    }

    renderSingleCard(data, position, clickAction) {
      return(
        <Card className={ 'cardCarouselCard'+position }>
          <CardActionArea className='cardCarouselAction' onClick={ clickAction }>
            <span className='cardCarouselMediaContainer'>
              <img
                className='cardCarouselMedia'
                alt={ data.first_name+' image' }
                src={ data.img_src }
                title={ data.first_name+' Testimonial' }
              />
              <span className='cardCarouselMediaQuote'>
                { data.quote }
              </span>
            </span>
            <CardContent className='cardCarouselContent'>
              <h3 className='cardCarouselFirstName'>
                { data.first_name }
              </h3>
              <p>
                { data.role }
              </p>
              <p>
                { data.location }
              </p>
            </CardContent>
          </CardActionArea>
        </Card>
      );
    }

    renderDeck() {
      console.log(this.props.data.length);
      return(
        <span className='cardCarouselContainer'>
          { this.state.activeStep > 0 ? this.renderSingleCard(this.props.data[this.state.activeStep-1], 'left', this.handleBack) : '' }
          { this.renderSingleCard(this.props.data[this.state.activeStep], 'center') }
          { this.state.activeStep < this.props.data.length-1 ? this.renderSingleCard(this.props.data[this.state.activeStep+1], 'right', this.handleNext) : '' }
        </span>
      );
    }

    render() {
        return( this.renderDeck() );
    }
}

TestimonialsCarousel.propTypes = {
    data: PropTypes.array.isRequired,
  };

export default TestimonialsCarousel;