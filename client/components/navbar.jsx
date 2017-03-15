import React from 'react'
import {translate} from '../utils/translate'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {setLanguage} from '../actions/language'

class Navbar extends React.Component {
	constructor(){
		super()
		this.state = {
			showing: false
		}
	}
	addToggle(){
		return (e) => {
			e.preventDefault();
			this.setState({showing: !this.state.showing})
		}
	}
	render() {
		const showMenu = this.state.showing ? "show" : "hide"

		const {toggleLanguage, language, tr} = this.props;

		return (	
			<nav className="header-nav column">
				<Link id="header-menu-button" to="" onClick={this.addToggle()}>Menu</Link>
				<menu id="header-menu" className={`row ${showMenu}`}>
					<Link to="/student/sign_up">{tr("student_sign_up_link")}</Link>
					<Link to="/volunteer/sign_up">{tr("volunteer_sign_up_link")}</Link>
					<Link to="/sign_in">{tr("sign_in_link")}</Link>
					<Link to="/" onClick={toggleLanguage(language)}>{tr("language_toggle")}</Link>
				</menu>
			</nav>
		);		
	}
}

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

export default connect(null, mapDispatch)(translate("App")(Navbar));