import React from 'react'
import {Route} from 'react-router'

import Header from './header'
import Home from './home'
import Footer from './footer'

class Layout extends React.Component {
	render(){
		const {children} = this.props;
		return (
			<div id="layout">
				<Header/>
				{children}
				<Footer/>
			</div>
		)
	}
}

export default Layout;