import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import _ from 'lodash';

import './TeachersList.css';

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired,
    };

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      });
    };

    render() {
      return (
        <ComposedComponent
          value={ this.state.selectedIndex }
          onChange={ this.handleRequestChange }
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

SelectableList = wrapState(SelectableList);

const TeachersList = ({ header, items }) => (
  <div className='resultsListContainer'>
    <SelectableList defaultValue={ 0 }>
      <Subheader>{ header }</Subheader>
      { _.map(items, ({ first_name, city, last_sign_in_at }, index) => {
        return (
          <ListItem
            style={ { height: '80px' } }
            key={ index }
            value={ index }
            primaryText={
              <div>
                <span className='resultsFirstName'>
                  { first_name }
                </span>
                <span className='resultsLastLogin'>
                  { last_sign_in_at? `Last logged: ${ last_sign_in_at } ago` : '' }
                </span>
              </div>
            }
            secondaryText={ city? city : '' }
          />
        );
      }) }

    </SelectableList>
  </div>
);

TeachersList.propTypes = {
  header: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired
};

export default TeachersList;
