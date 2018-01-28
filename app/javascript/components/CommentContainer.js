import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { FormattedMessage } from 'react-intl';
import { getData } from './utils/sendData';
import formatLink from './utils/Link';

import { LOWEST, HIGHEST, OLDEST, RECENT } from './SortFilter';

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
        { this.renderCommentHeader() }
        <ul className='commentContainerList'>
          { this.renderListItems() }
        </ul>
      </div>
    );
  }

  renderCommentHeader() {
    const { comments: { count } } = this.state;

    if (count > 10) {
      return (
        <div>
          <h4 className='commentContainerTitleWithDropDown'>
            Comments
          </h4>
          <DropDownMenu className='commentContainerDropdown' value={ this.state.sortBy } onClose={ this.handleBlur } onChange={ this.handleChange } >
            <MenuItem value={ 0 } primaryText='Sort by' />
            <MenuItem value={ RECENT } primaryText='Most Recent' />
            <MenuItem value={ OLDEST } primaryText='Oldest' />
            <MenuItem value={ HIGHEST } primaryText='Highest Rating' />
            <MenuItem value={ LOWEST } primaryText='Lowest Rating' />
          </DropDownMenu>
        </div>
      );
    } else {
      return (
        <h4 className='commentContainerTitle'>
          Comments
        </h4>
      );
    }
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

      successCallBack: ({ ten_last_comments }) => {
        this.setState({
          comments: { ten_last_comments }
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
    const { comments: { ten_last_comments } } = this.state;
    const { locale } = this.props;

    if (_.size(ten_last_comments) > 0) {
      return _.map(ten_last_comments, ({ comment, created_at, reviewer, reviewer_url_slug }, index) => {

        return (
          <li key={ index } className='commentContainerListItem'>
            <span>Posted { created_at } - </span>
            <span>by
              <span> </span>
              <a href={ formatLink(`/reviews/${reviewer_url_slug}`, locale)} className='slidingLink commentContainerLink'>
                { reviewer }
              </a>:
            </span>
            <span> { this.renderComment(comment) }</span>
          </li>
        );
      });
    } else {
      return (
        <li>
          <FormattedMessage
           id='CommentContainer.noCommentAvailable'
            defaultMessage='No comments available'
          />
        </li>
      )
    }
  }

  renderComment(comment) {
    if (comment) {
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
  locale: PropTypes.string,
  userId: PropTypes.string,
  comments: PropTypes.shape({
    count: PropTypes.number,
    ten_last_comments: PropTypes.arrayOf(
      PropTypes.shape({
        comment: PropTypes.string,
        created_at: PropTypes.string,
        reviewer: PropTypes.string
      })
    )
  })
};

CommentContainer.defaultProps = {
  comments: { },
  userId: ''
};

export default CommentContainer;
