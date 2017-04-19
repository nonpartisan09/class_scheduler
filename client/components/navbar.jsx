import React from 'react'
import {translate} from '../utils/translate'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {setLanguage} from '../actions/language'
import { logout } from '../actions/session'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import { urlFor } from '../utils/cloudinary'
const notLoggedIn = (props) => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/">Tutoria</a>
      </Navbar.Brand>
      <Navbar.Toggle/>
    </Navbar.Header>
    <Navbar.Collapse>
	    <Nav>
	      <NavItem eventKey={1} href="/#/student/signup">{props.tr("student_sign_up_link")}</NavItem>
	      <NavItem eventKey={2} href="/#/volunteer/signup">{props.tr("volunteer_sign_up_link")}</NavItem>
	      {React.createElement(DropDownMenu, props)}
	    </Nav>
    </Navbar.Collapse>
  </Navbar>
);

const DropDownMenu = ({ user, logout, tr, toggleLanguage, language }) => {
	if (!user) {
		return (
			<div>
				<NavItem eventKey={2} onClick={toggleLanguage(language)} href="#">{tr("language_toggle")}</NavItem>
				<NavItem eventKey={2} href="login">{tr("sign_in_link")}</NavItem>	
			</div>	
		);
	} else {
		return (
    <NavDropdown 
    	eventKey={3} 
    	title={<Greeting user={user} />} 
    	id="basic-nav-dropdown">
			<MenuItem eventKey={2} >
				<a href="#" onClick={toggleLanguage(language)}>
					{tr("language_toggle")}
				</a>
			</MenuItem>
      <MenuItem eventKey={3.1}>
      	<a onClick={ logout }>{ tr("logout") }</a>
      </MenuItem>
    </NavDropdown>			
		);
	}
}

const Greeting = ({ user }) => (
	<span className="greeting">
		{user.first_name}
		<img className="avatar" src={urlFor(user.public_id)} />
	</span>
);

const AppNavBar = (props) => {
	if (true) {
		// no user signed in
		return React.createElement(notLoggedIn, props);
	} else {
		// user signed in
	}
}
// class Navbar extends React.Component {
// 	constructor(){
// 		super()
// 		this.state = {
// 			showing: false
// 		}
// 		this.hide = this.hide.bind(this);
// 	}
// 	handleClickOutside(){
// 		this.hide();
// 	}
// 	hide(){
// 		this.setState({showing: false})
// 	}
// 	addToggle(){
// 		return (e) => {
// 			e.preventDefault();
// 			this.setState({showing: !this.state.showing})
// 		}
// 	}
// 	render() {
// 		const showMenu = this.state.showing ? "show" : "hide"
// 		const {toggleLanguage, language, tr, user, logout} = this.props;
// 		if (!user.id) {
// 			return (	
// 				<nav className="header-nav column">
// 					<Link id="header-menu-button" to="" onClick={this.addToggle()}>Menu</Link>
// 					<menu id="header-menu" className={`row ${showMenu}`} onClick={this.hide}>
// 						<Link to="/student/sign_up">{tr("student_sign_up_link")}</Link>
// 						<Link to="/volunteer/sign_up">{tr("volunteer_sign_up_link")}</Link>
// 						<Link to="/sign_in">{tr("sign_in_link")}</Link>
// 						<Link to="/" onClick={toggleLanguage(language)}>{tr("language_toggle")}</Link>
// 					</menu>
// 				</nav>
// 			);		
// 		} else {
// 			return (
// 				<nav className="header-nav column">
// 					<span id="header-menu-button" className="logged-in" onClick={this.addToggle()}>
// 						<Link to="">Hi, {user.first_name}!</Link>
// 						<img className="thumbnail-small" src={user.profile_src}/>
// 					</span>
// 					<menu id="header-menu" className={`logged-in row ${showMenu}`} onClick={this.hide}>
// 						<Link to="/" onClick={logout}>{tr("logout")}</Link>
// 						<Link to="/" onClick={toggleLanguage(language)}>{tr("language_toggle")}</Link>
// 					</menu>
// 				</nav>
// 			)		
// 		}
// 	}
// }

const mapState = ({session: { user }}) => ({user})
const mapDispatch = dispatch => ({
	logout: () => dispatch(logout()),
	toggleLanguage: language => e => {
		e.preventDefault();
		if (language === "en") {
			dispatch(setLanguage("es"))
		} else {
			dispatch(setLanguage("en"))			
		}
	}
})

export default connect(mapState, mapDispatch)(translate("App")(AppNavBar));