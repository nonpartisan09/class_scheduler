import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { FormattedMessage } from 'react-intl';

import './PaypalButton.css';

class PaypalButton extends Component {
  render() {
    return (
      <form rel='noreferrer nooppener' className='paypalButtonContainer' action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="BJAVH4P92JSTS" />
        <FlatButton
          label={
            <FormattedMessage
              id='PaypalButton.donate'
              defaultMessage='Donate on Paypal'
            />
          }
          primary
          type='submit'
          />
      </form>
    );
  }

}

PaypalButton.propTypes = {

};

PaypalButton.defaultProps = {

};

export default PaypalButton;
