import React, { Component } from 'react';
import {
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    CardActions,
    MobileStepper,
    Button,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import {
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa';

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

    render() {
        const maxSteps = this.props.data.length;
        return(
          <span className='cardCarouselContainer'>
            <Card className='cardCarouselCard'>
              <CardActionArea>
                <CardMedia
                  className='cardCarouselMedia'
                  component="img"
                  alt={ this.props.data[this.state.activeStep].first_name+' image' }
                  height="140"
                  image={ this.props.data[this.state.activeStep].img_src }
                  title={ this.props.data[this.state.activeStep].first_name+' Testimonial' }
                />
                <CardContent className='cardCarouselContent'>
                  <h3 className='cardCarouselFirstName'>
                    { this.props.data[this.state.activeStep].first_name }
                  </h3>
                  <p>
                    { this.props.data[this.state.activeStep].role }
                  </p>
                  <p>
                    { this.props.data[this.state.activeStep].location }
                  </p>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <MobileStepper
                  position='static'
                  steps={ maxSteps }
                  nextButton={ (
                    <Button size="small" onClick={ this.handleNext } disabled={ this.state.activeStep === maxSteps - 1 }>
                      Next
                      <FaArrowRight />
                    </Button>
                  ) }
                  backButton={ (
                    <Button size="small" onClick={ this.handleBack } disabled={ this.state.activeStep === 0 }>
                      Back
                      <FaArrowLeft />
                    </Button>
                  ) }
                />
              </CardActions>
            </Card>
          </span>
        );
    }
}

TestimonialsCarousel.propTypes = {
    data: PropTypes.array.isRequired,
  };

export default TestimonialsCarousel;