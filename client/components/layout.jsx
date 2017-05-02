import React from 'react'
import {Route} from 'react-router'

import Header from './header'
import Home from './home'
import Footer from './footer'
import Notice from './notice'
import {fetchCurrentUser} from '../actions/session'
import {connect} from 'react-redux'
import { translate } from '../utils/translate';

class Layout extends React.Component {
	componentDidMount(){
		this.props.fetchCurrentUser();
	}
	notices() {
		const { notices, tr } = this.props;

		if (notices.length < 1) return null;

		const noticeEls = notices.map(({ category, message }, i) => (
			<Notice category={category} message={tr(message)} key={category + message} />
		));

		return <div className="notice-container">{noticeEls}</div>;
	}
	render() {
		const { children } = this.props;
		return (
			<div id="layout">
				<Header />
				{this.notices()}
				{children}
				<Footer />
			</div>
		);
	}
}

const mapState = ({ notices }) => ({ notices });

const mapDispatch = ({ fetchCurrentUser });

export default translate("Alert")(connect(mapState, mapDispatch)(Layout));
