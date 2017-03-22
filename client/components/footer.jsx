import React from 'react'
import {Link} from 'react-router'
import {translate} from '../utils/translate'
import {setLanguage} from '../actions/language'
import {connect} from 'react-redux'
import Logo from './logo'
import Navbar from './navbar'

const Footer = ({toggleLanguage, language, tr}) => (
	<footer id="app-footer">
		<Link to="/">{tr("home")}</Link>
		<Link to="/contact">{tr("contact")}</Link>
		<Link to="/" onClick={toggleLanguage(language)}>{tr("language_toggle")}</Link>
	</footer>
);

const mapDispatch = dispatch => ({
	toggleLanguage: language => e => {
		e.preventDefault();
		if (language === "eng") {
			dispatch(setLanguage("spa"))
		} else {
			dispatch(setLanguage("eng"))			
		}
	}
})

export default connect(null, mapDispatch)(translate("App")(Footer));