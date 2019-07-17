import React, { Component } from 'react';
import {
    Button,
    withStyles
} from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = {
    button: {
        color: '#004664',
        fontFamily: 'Lato',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: 0,
        paddingLeft: '1pc',
        paddingRight: '1pc',
        textTransform: 'none',
        position: 'relative',
        marginBottom: '3px',
        display: 'grid',
        transition: 'width 3s ease',
        '&:hover': {
            background: 'inherit',
            '& $slidingLine': {
                background: '#f1592a',
                width: '100%',
                transition: 'width .2s ease',
            }
        },
        '&:focus': {
            background: 'inherit',
            '& $slidingLine': {
                background: '#f1592a',
                width: '100%',
                transition: 'width .2s ease',
            }
        },
        '&:disabled': {
            color: '#F1592A',
        },
    },
    greyButton: {
        color: 'darkGrey',
        fontFamily: 'Lato',
        fontSize: '16px',
        fontWeight: 'normal',
        padding: 0,
        paddingLeft: '1pc',
        paddingRight: '1pc',
        textTransform: 'none',
        marginBottom: '3px',
        display: 'grid',
        transition: 'width 3s ease',
        '&:hover': {
            background: 'inherit',
            '& $slidingLine': {
                background: '#f1592a',
                width: '100%',
                transition: 'width .2s ease',
            }
        },
        '&:focus': {
            background: 'inherit',
            '& $slidingLine': {
                background: '#f1592a',
                width: '100%',
                transition: 'width .2s ease',
            }
        },
    },
    slidingLine: {
        width: '0%',
        height: '3px',
    },
    sliderButtonText: {
        paddingLeft: '5px',
        paddingRight: '5px',
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
  };

  class SliderButton extends Component {
      render() {
          const { classes, grey, ...other } = this.props;
          return(
            <span id='slider-button-container' className='sliderButtonContainer'>
              <Button
                className={ grey ? classes.greyButton : classes.button }
                disableFocusRipple
                { ...other }
                >
                <span
                  id='slider-button-text'
                  className={ classes.sliderButtonText }
                  { ...other }
                >
                  { this.props.children }
                </span>
                <span
                  id='slide-line'
                  className={ classes.slidingLine }
                />
              </Button>
            </span>
          );
      }
  }

  SliderButton.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.any.isRequired,
    grey: PropTypes.bool,
  };

  SliderButton.defaultProps = {
      grey: false,
  };
  
  export default withStyles(styles)(SliderButton);