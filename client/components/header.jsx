import React from 'react'
import {Link} from 'react-router'
import {translate} from '../utils/translate'
import {connect} from 'react-redux'
import Logo from './logo'
import Navbar from './navbar'

const Header = () => (
	<header id="app-header" className="row">
		<Logo/>
		<Navbar/>
	</header>
);

export default Header;