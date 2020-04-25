import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Parser from 'html-react-parser';
import { ENGLISH } from './utils/availableLocales';

class CustomPage extends Component {
  render() {
    const { page_content, locale } = this.props;
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
  locale: PropTypes.string,
  page_content: PropTypes.shape({
    description: PropTypes.node,
    spanish_description: PropTypes.node,
  })

};

CustomPage.defaultProps = {
  locale: ENGLISH,
  page_content: { },
};

export default CustomPage;
