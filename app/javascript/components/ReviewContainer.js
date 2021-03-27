import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { FormattedMessage } from 'react-intl';

class ReviewContainer extends Component {
  constructor(props) {
    super(props);

    this.handleStarClick = this.handleStarClick.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    const { review: { review, comment } } = props;

    this.state = {
      comment: comment,
      review: review,
      error: ''
    };
  }

  render() {
    const { comment } = this.state;

    return (
      <div>
        <div className='reviewContainerReview'>
          { this.renderReview() }
        </div>
        <div className='reviewContainerComment'>
          <TextField
            name='comment'
            value={ comment }
            hintText=''
            errorText={ this.state.error }
            errorStyle={ { float: 'left', margin: '-6px 0' } }
            floatingLabelText={ (
              <FormattedMessage
                id='ReviewContainer.comment'
                defaultMessage='Leave a comment'
              />
            ) }
            onChange={ this.handleChangeComment }
            floatingLabelFixed
          />
        </div>

        <RaisedButton
          primary
          className='reviewContainerSubmitButton'
          label={ (
            <FormattedMessage
              id='ReviewContainer.SubmitButton'
              defaultMessage='Submit Review'
            />
          ) }
          onClick={ this.handleSubmit }
        />
      </div>
    );
  }

  renderReview() {
    const { review } = this.state;

    return [
      _.times(5, (index) => {
        const className = function(){
          if (index < review) {
            return 'reviewContainerStar reviewContainerStarSelected';
          } else {
            return 'reviewContainerStar';
          }
        }();

        return (
          <div onClick={ this.handleStarClick } key={ index } className={ className }>
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

  handleChangeComment({ target: { value } }) {
    this.setState({
      comment: value
    });
  }

  handleStarClick({ target }) {
    if (target.value && target.value >= 0 && target.value !== this.state.review) {
      this.setState({
        review: _.toNumber(target.value)
      });
    }
  }

  handleSubmit() {
    const { comment, review } = this.state;
    const { onClick } = this.props;

    if (comment && !review) {
      this.setState({
        error: 'Please leave a rating'
      });
    } else if (!review) {
      this.setState({
        error: 'Minimum 1 star rating required'
      });
    }else {
      onClick(review, comment);
    }
  }

}

ReviewContainer.propTypes = {
  review: PropTypes.shape({
    comment: PropTypes.string,
    review: PropTypes.number
  }),
  onClick: PropTypes.func.isRequired
};

ReviewContainer.defaultProps = {
  review: {
    comment: '',
    review: 0
  }
};

export default ReviewContainer;
