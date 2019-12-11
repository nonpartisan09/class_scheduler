import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Parser from 'html-react-parser';

import ChooseLanguage from './utils/ChooseLanguage';


class CustomPage extends Component {
  render() {
    const { page_content, currentUser, locale } = this.props;
    const content = function(){
    
      if (locale && page_content) {
        return Parser(page_content[locale]);
      } else {
        return null;
      }
    }();

    return (
      <div>
        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
          <div className='customPageContainer'>
            { content }
          </div>
        </Paper>
      </div>
    );
  }

}

CustomPage.propTypes = {
  currentUser: PropTypes.object.isRequired,
  page_content: PropTypes.shape({
    description: PropTypes.node,
    spanish_description: PropTypes.node
  })

};

CustomPage.defaultProps = {
  page_content: { }
};

export default CustomPage;
