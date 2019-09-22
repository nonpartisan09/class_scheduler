import React, { Component } from 'react';
import {
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import {
  Player,
  BigPlayButton
} from 'video-react';

import {
  SPANISH
} from './utils/availableLocales';

class TestimonialsCarousel extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            activeStep: 0,
        };
    }
    
    handleNext = () => {
      this.setState(prevState => {
         return {
          activeStep: prevState.activeStep + 1,
        };
      });
    }
    
    handleBack = () => {
      this.setState(prevState => {
         return {
          activeStep: prevState.activeStep - 1,
        };
      });
    }

    renderSingleCard(data, position, clickAction) {
      let names, quote1, quote2, role;
      const locale = localStorage.getItem('locale');

      if (locale === SPANISH) {
        names = data.es_names;
        quote1 = data.es_quote1;
        quote2 = data.es_quote2;
        role = data.es_role;
      }
      else {
        names = data.names;
        quote1 = data.quote1;
        quote2 = data.quote2;
        role = data.role;
      }


      return(
        <Card
          className={ 'cardCarouselCard'+position }
          >
          { 
            data.video && position === 'center'
            ?
            (
              <span className='cardCarouselVideoContainer'>
                <span className='cardCarouselMediaContainer'>
                  <Player
                    className='cardCarouselMediaPlayer'
                    src={ data.video_src }
                    poster={ data.img_src }
                    playsInline
                    fluid={ false }
                    height='inherit'
                  >
                    <BigPlayButton position='center' />
                  </Player>
                </span>
                <CardContent className='cardCarouselContent'>
                  <h3 className='cardCarouselFirstName'>
                    { names }
                  </h3>
                  <p>
                    { role }
                  </p>
                  <p>
                    { data.location }
                  </p>
                </CardContent>
              </span>
            )
            :
            (
              <CardActionArea className='cardCarouselAction' onClick={ clickAction }>
                <span className='cardCarouselMediaContainer'>
                  <CardMedia
                    className='cardCarouselMedia'
                    component='img'
                    alt={ names+' image' }
                    src={ data.img_src }
                    title={ names+' Testimonial' }
                  />
                  <span className='cardCarouselMediaQuote'>
                    <p>{ quote1 }</p>
                    { quote2 && <p>{ quote2 }</p> }
                  </span>
                </span>
                <CardContent className='cardCarouselContent'>
                  <h3 className='cardCarouselFirstName'>
                    { names }
                  </h3>
                  <p>
                    { role }
                  </p>
                  <p>
                    { data.location }
                  </p>
                </CardContent>
              </CardActionArea>
            )
          }
        </Card>
      );
    }

    renderDeck() {
      return(
        <span className='cardCarouselContainer'>
          { this.state.activeStep > 0 ? this.renderSingleCard(this.props.data[this.state.activeStep-1], 'left', this.handleBack) : '' }
          { this.renderSingleCard(this.props.data[this.state.activeStep], 'center', this.handlePlayer) }
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
