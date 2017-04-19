import React from 'react'
import {Route} from 'react-router'

import Header from './header'
import Home from './home'
import Footer from './footer'

import {fetchCurrentUser} from '../actions/session'
import {connect} from 'react-redux'

class Layout extends React.Component {
	componentDidMount(){
		this.props.fetchCurrentUser();
	}
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

const mapDispatch =({
	fetchCurrentUser
})

export default connect(null, mapDispatch)(Layout);