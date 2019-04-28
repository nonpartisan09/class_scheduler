import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

class Footer extends Component {
  render() {
    const { className } = this.props;
    return (
      <div className={ `footerContainer ${className}` } >
        <div className='footer'>
          <p>
            <a href='/terms_of_use' className='slidingLink footerLink' target='_blank' rel='noreferrer noopener nofollow'>
              <FormattedMessage
                id='Footer.termsLink'
              />
            </a>
          </p>
          <p>
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
  className: PropTypes.string
};

Footer.defaultProps = {
  className: ''
};

export default Footer;
