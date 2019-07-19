import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Parser from 'html-react-parser';

import ChooseLanguage from './utils/ChooseLanguage';
import Footer from './reusable/Footer';
import Header from './reusable/Header';


class CustomPage extends Component {
  render() {
    const { page_content, currentUser } = this.props;
    const content = function(){
      if (ChooseLanguage() === 'es' && page_content['es']) {
        return Parser(page_content['es']);
      } else if (page_content['en']) {
        return Parser(page_content['en']);
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
