import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import Divider from 'material-ui/Divider';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <div className='footerContainer' >
        <Divider />
        <div className='footer'>
          <p>
            <a href='/terms_of_use' className='slidingLink footerLink' target='_blank' rel='noreferrer noopener nofollow'>
              <FormattedMessage
                id='Footer.termsLink'
                defaultMessage='Terms of Use and Privacy Policy'
              />
            </a>
            Copyright © 2017 Tutoria, Inc. All rights reserved.

          </p>
          <p>
            495A Henry St #1020, Brooklyn, NY, 11231, United States of America
          </p>
        </div>
      </div>
    );
  }

}

Footer.propTypes = {

};

Footer.defaultProps = {

};

export default Footer;
