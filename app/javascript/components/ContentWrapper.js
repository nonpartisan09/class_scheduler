import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import NonChromeMessage from './reusable/NonChromeMessage';
import Header from './reusable/Header';
import Footer from './reusable/Footer';

class ContentWrapper extends Component {
    constructor(props) {
        super(props);

        this.setContentHeight = this.setContentHeight.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.calculateFooterPosition = this.calculateFooterPosition.bind(this);

        this.state = {
            contentHeight: 0,
            mobile: false,
        };
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        this.setState({ contentHeight: this.pagecontent.offsetHeight });
    }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    componentDidUpdate(prevProps) {
        if(this.props.location !== prevProps.location) {
            this.updateWindowDimensions();
            this.setContentHeight();
        }
    }

    setContentHeight() {
        this.setState({ contentHeight: this.pagecontent.offsetHeight });
    }
    
    updateWindowDimensions() {
    if (window.innerWidth < 900) {
        this.setState({ mobile: true });
    } else {
        this.setState({ mobile: false });
    }
    }

    calculateFooterPosition() {
        return(
            this.state.contentHeight < (0.5*window.innerHeight)
            && !this.state.mobile
            ?
            'absolute'
            :
            'relative'
        );
    }

    render () {
        const childrenWithProps = React.Children.map(this.props.children, child =>
            React.cloneElement(child, this.props.currentUser)
          );

        return (
          <div className='pageWrapper'>
            <Header currentUser={ this.props.currentUser } mobile={ this.state.mobile } />
            <div
              className='pageContent'
              ref={ (pagecontent) => this.pagecontent = pagecontent }
            >
              {childrenWithProps}
            </div>
            <Footer style={ { position: this.calculateFooterPosition() } } currentUser={ this.props.currentUser } />
            <NonChromeMessage />
          </div>
        );
    }
}

ContentWrapper.propTypes = {
    children: PropTypes.any,
    currentUser: PropTypes.object,
    location: PropTypes.object.isRequired,
};
  
ContentWrapper.defaultProps = {
    children: {},
    currentUser: {},
};

export default withRouter(ContentWrapper);