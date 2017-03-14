import React from 'react'
import {Link} from 'react-router';

const Header = () => (
	<header id="app-header">
		<nav className="links">
			<Link to="/student/sign_up">
			</Link>
			<Link to="/volunteer/sign_up">
			</Link>
			<Link to="/student/sign_up">
			</Link>
		</nav>
	</header>
);

export default Header;