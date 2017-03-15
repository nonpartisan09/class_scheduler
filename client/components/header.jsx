import React from 'react'
import {Link} from 'react-router'
import {translate} from '../utils/translate'
import {connect} from 'react-redux'
import {setLanguage} from '../actions/language'
import Logo from './logo'

const Header = ({toggleLanguage, language, tr}) => (
	<header id="app-header" className="row">
		<Logo/>
		<nav className="header-links row">
			<Link to="/student/sign_up">{tr("student_sign_up_link")}
			</Link>
			<Link to="/volunteer/sign_up">{tr("volunteer_sign_up_link")}
			</Link>
			<Link to="/" onClick={toggleLanguage(language)}>{tr("language_toggle")}</Link>
		</nav>
	</header>
);

const mapState = ({language}) => ({
	language: language.default
})

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

// export default Header;
export default connect(mapState, mapDispatch)(translate("App")(Header));