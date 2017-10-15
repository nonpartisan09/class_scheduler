import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';

import './Header.css';
import Header from './Header';

class MyProfile extends Component {
  render() {
    return (
      <div>
        <Header currentUser={ this.props.currentUser } />
        { this.renderUser() }

      </div>
    );
  }

  renderUser() {
    const { currentUser } = this.props;

    if ( _.size(currentUser) > 0 ) {
      return (
        <List>
          <ListItem >
            <div>
              Username:
            </div>
            { currentUser.display_name }
          </ListItem>
          <ListItem>
            <div>
              Location:
            </div>
            { currentUser.location }
          </ListItem>

          <ListItem>
            Interested in studying:
          </ListItem>

          { this.renderClasses() }

          <ListItem>
            Languages:
          </ListItem>
          { this.renderLanguages() }
        </List>

      );
    } else {
      return null;
    }
  }

  renderLanguages() {
    const { currentUser: { languages } } = this.props;

    if (_.size(languages) > 0) {
      return _.map(languages, (value, key) => {
        return (
          <ListItem key={ key }>
            { _.upperFirst(key) }
          </ListItem>
        );
      })
    }
  }

  renderClasses() {
    const { currentUser: { courses } } = this.props;

    if (_.size(courses) > 0) {
      _.map(courses, (course, index) => {
        return (
          <ListItem key={ index }>
            { courses}
          </ListItem>
        );
      })
    } else {
      return (
        <ListItem>
          No class has been selected yet.
        </ListItem>
      );
    }
  }
}

MyProfile.propTypes = {
  currentUser: PropTypes.object,
};

MyProfile.defaultProps = {
  currentUser: { }
};

export default MyProfile;
