import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import { FormattedMessage } from 'react-intl';


class PaypalButton extends Component {
  render() {
    const buttonStyle = {
      'backgroundColor': '#F1592A',
      'color': 'white',
      'fontFamily': 'Lato',
      'fontSize': '18px',
      'fontWeight': 'bold',
      'paddingRight': '3pc',
      'paddingLeft': '3pc',
      'textTransform': 'none'
    };

    return (
      <form rel='noreferrer nooppener' className='paypalButtonContainer' action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="BJAVH4P92JSTS" />
        <Fab
          className='paypalButton'
          variant='extended'
          style={ buttonStyle }
          >
          <FormattedMessage
            id='PaypalButton.donate'
            defaultMessage='Donate'
          />
        </Fab>
      </form>
    );
  }

}

PaypalButton.propTypes = {

};

PaypalButton.defaultProps = {

};

export default PaypalButton;
