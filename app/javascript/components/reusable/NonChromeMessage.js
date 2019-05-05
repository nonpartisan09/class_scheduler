import React, {Component} from 'react';
import { FormattedMessage } from 'react-intl';
import './NonChromeMessage.css';

class NonChromeMessage extends Component {
    render() {
        const ua = navigator.userAgent.split(' ');
        let styles = {
            display: ua[ua.length-1].includes('Safari') && ua[ua.length - 2].includes('Chrome') ? 'none' : 'block'
        };
        return (
          <h3 style={ styles } className="notice-warning">
            <FormattedMessage
              id='NonChromeMessage'
              defaultMessage='For optimal performance, {link} is recommended.'
              values={ {
                  link: <a href="https://www.google.com/chrome" rel="noopener noreferrer" target="_blank">Google Chrome</a>
              } }
            />
          </h3>
        );
    }
}

export default NonChromeMessage;
