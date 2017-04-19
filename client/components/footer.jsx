import React from 'react'
import {Link} from 'react-router'
import {translate} from '../utils/translate'
import {setLanguage} from '../actions/language'
import {connect} from 'react-redux'
import Logo from './logo'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'

const Footer = ({toggleLanguage, language, tr}) => (
  <Navbar>
    <Nav>
      <NavItem eventKey={1} href="#">{tr("home")}</NavItem>
      <NavItem eventKey={2} href="#">{tr("contact")}</NavItem>
      <NavItem eventKey={2} onClick={toggleLanguage(language)} href="#">{tr("language_toggle")}</NavItem>
    </Nav>
  </Navbar>
);

const mapDispatch = dispatch => ({
	toggleLanguage: language => e => {
		e.preventDefault();
		if (language === "en") {
			dispatch(setLanguage("es"))
		} else {
			dispatch(setLanguage("en"))			
		}
	}
})

export default connect(null, mapDispatch)(translate("App")(Footer));