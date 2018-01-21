import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Parser from 'html-react-parser';

import ChooseLanguage from './utils/ChooseLanguage';
import Footer from './Footer';
import Header from './Header';

import './AboutPage.css';

class AboutPage extends Component {
  render() {
    const { about_page_content, currentUser } = this.props;
    const content = function(){
      if (ChooseLanguage() === 'es' && about_page_content['es']) {
        return Parser(about_page_content['es']);
      } else if (about_page_content['en']) {
        return Parser(about_page_content['en']);
      } else {
        return null;
      }
    }();

    return (
      <div>
        <Header currentUser={ currentUser } />
        <Paper zDepth={ 1 } className='paperOverride' rounded={ false }>
          <div className='aboutPageContainer'>
            { content }
          </div>
        </Paper>
        <Footer />
      </div>
    );
  }

}

AboutPage.propTypes = {
  currentUser: PropTypes.object.isRequired,
  about_page_content: PropTypes.shape({
    description: PropTypes.node,
    spanish_description: PropTypes.node
  })

};

AboutPage.defaultProps = {
  about_page_content: { }
};

export default AboutPage;
