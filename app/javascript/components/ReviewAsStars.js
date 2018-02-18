import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './ReviewAsStars.css';

class ReviewAsStars extends Component {
  render() {
    const { ratingCount } = this.props;

    if (ratingCount > 0) {
      return (
        <div>
          <div className='reviewAsStarsStarContainer'>
            { this.renderStars() }
          </div>

          <span className='reviewAsStarsLabel'>
            { `${ratingCount} rating(s)`}
          </span>
        </div>
      );
    } else {
      return null;
    }
  }

  renderStars() {
    const { averageRating } = this.props;

    return [
      _.times(5, (index) => {
        const className = function(){
          if (index < averageRating) {
            return 'reviewAsStarsStarItem reviewAsStarsStarItemSelected';
          } else {
            return 'reviewAsStarsStarItem';
          }
        }();

        return (
          <div key={ index } className={ className }>
            <label htmlFor={ `starRating${index}` } />
            <option
              value={ index + 1 }
              id={ `starRating${index}` }
            />
          </div>
        );
      })
    ];
  }
}

ReviewAsStars.propTypes = {
  averageRating: PropTypes.number,
  ratingCount: PropTypes.number
};

ReviewAsStars.defaultProps = {
  averageRating: 0,
  ratingCount: 0
};

export default ReviewAsStars;
