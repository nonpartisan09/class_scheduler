import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';

import './Header.css';
import Header from './Header';

import './MyProfile.css';

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
              Email:
            </div>
            { currentUser.email }
          </ListItem>
          <ListItem>
            <div>
              Location:
            </div>
            { currentUser.location }
          </ListItem>

          <ListItem>
            <span>{ currentUser.student? 'Interested in studying: ' : 'Can teach: ' }</span>
            { _.join(this.renderClasses(),(', ')) }
          </ListItem>

          <ListItem>
            <span>Languages: </span>
            <span>{ _.join(this.renderLanguages(),(', ')) }</span>
          </ListItem>
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
        return _.upperFirst(key);
      });
    }
  }

  renderClasses() {
    const { currentUser: { courses } } = this.props;

    if (_.size(courses) > 0) {
     return _.map(courses, ({ name }) => name);
    } else {
      return <span>No class has been selected yet.</span>;
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
