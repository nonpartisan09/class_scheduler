import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { FormattedMessage } from 'react-intl';

import { LOWEST, HIGHEST, OLDEST, RECENT } from './SortFilter';

import { getData } from './utils/sendData';
import './CommentContainer.css';

class CommentContainer extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      sortBy: 0,
      message: '',
      comments: props.comments
    };
  }

  render() {
    return (
      <div className='commentContainerMainContainer'>
        <h4 className='commentContainerTitle'>
         Comments
        </h4>
        <DropDownMenu className='commentContainerDropdown' value={ this.state.sortBy } onClose={ this.handleBlur } onChange={ this.handleChange } >
          <MenuItem value={ 0 } primaryText='Sort by' />
          <MenuItem value={ RECENT } primaryText='Most Recent' />
          <MenuItem value={ OLDEST } primaryText='Oldest' />
          <MenuItem value={ HIGHEST } primaryText='Highest Rating' />
          <MenuItem value={ LOWEST } primaryText='Lowest Rating' />
        </DropDownMenu>
        <ul className='commentContainerList'>
          { this.renderListItems() }
        </ul>
      </div>
    );
  }

  handleChange(event, index, value) {
    this.setState({
      sortBy: value
    });
  }

  handleBlur() {
    const { userId } = this.props;
    const { sortBy } = this.state;

    const requestParams = {
      url: `/reviews/${userId}/${sortBy}`,

      successCallBack: ({ comments }) => {
        this.setState({
          comments
        });
      },

      errorCallBack: (message) => {
        this.setState({
          message: message,
        });
      }
    };

    return getData(requestParams);
  }

  renderListItems() {
    const { comments } = this.state;

    if (_.size(comments) > 0) {
      return _.map(comments, ({ comment, created_at, reviewer }, index) => {
        return (
          <li key={ index } className='commentContainerListItem'>
            <span>Posted { created_at } - </span>
            <span>by { reviewer } -</span>
            <span> { this.renderComment(comment) }</span>
          </li>
        );
      });
    } else {
      return (
        <li>
          <FormattedMessage
           id='CommentContainer.noCommentAvailable'
            defaultMessage='No comment available'
          />
        </li>
      )
    }
  }

  renderComment(comment) {
    if(comment) {
      return comment;
    } else {
      return (
        <FormattedMessage
          id='CommentContainer.unavailable'
          defaultMessage='Not available'
        />
      )
    }
  }
}

CommentContainer.propTypes = {
  userId: PropTypes.string,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      comment: PropTypes.string,
      created_at: PropTypes.string,
      reviewer: PropTypes.string
    })
  )
};

CommentContainer.defaultProps = {
  comments: [],
  userId: ''
};

export default CommentContainer;
