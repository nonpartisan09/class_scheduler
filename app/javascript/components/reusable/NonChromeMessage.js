import React, {Component} from 'react';
import { FormattedMessage } from 'react-intl';

class NonChromeMessage extends Component {
    render() {
        const browser = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)[1];
        let styles = {
            display: browser == 'Chrome' ? 'none' : 'block'
        };
        return (
          <h3 style={ styles } className="notice-warning">
            <FormattedMessage
              id='NonChromeMessage'
              defaultMessage='For optimal performance, {link} is recommended.'
              values={ {
                  link: <a href="https://www.google.com/chrome">Google Chrome</a>
              } }
            />
          </h3>
        );
    }
}

export default NonChromeMessage;
