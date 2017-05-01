import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { translate } from '../utils/translate';
import { setLanguage } from '../actions/language';
import { logout } from '../actions/session';
import { urlFor } from '../utils/cloudinary';

const Greeting = ({ user }) => (
	<span className="greeting">
		{user.first_name}
		<img className="avatar" src={urlFor(user.public_id)} />
	</span>
);

class AppNavBar extends React.Component {
	notLoggedIn() {
		const { user, logout, tr, toggleLanguage, language } = this.props;
		return ([
			<NavItem key={"nav_item_1"} eventKey={2} onClick={toggleLanguage(language)} href="#">{tr("language_toggle")}</NavItem>,
			<NavItem key={"nav_item_2"} eventKey={2} href="/#/login">{tr("sign_in_link")}</NavItem>
		]);
	}
	loggedIn() {
		const { user, logout, tr, toggleLanguage, language } = this.props;
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
	content() {
		const { user: { first_name } } = this.props;
		return first_name ? this.loggedIn() : this.notLoggedIn();
	}
	render(){
		const { user, logout, tr, toggleLanguage, language } = this.props;
		const loggedIn = !!user.first_name;
	  return (
	  	<Navbar>
		    <Navbar.Header>
		      <Navbar.Brand>
		        <a href="/">Tutoria</a>
		      </Navbar.Brand>
		      <Navbar.Toggle/>
		    </Navbar.Header>
		    <Navbar.Collapse>
			    <Nav>
			      <NavItem eventKey={1} href="/#/signup">{tr("student_sign_up_link")}</NavItem>
			      <NavItem eventKey={2} href="/#/signup">{tr("volunteer_sign_up_link")}</NavItem>
			      { loggedIn ? this.loggedIn() : this.notLoggedIn() }
			    </Nav>
		    </Navbar.Collapse>
		  </Navbar>
		);
	}
}

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