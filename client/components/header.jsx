import React from 'react'
import {Link} from 'react-router';
import {translate} from '../utils/translate'

const Header = ({tr}) => (
	<header id="app-header">
		<nav className="links">
			<div>HEADER</div>
		</nav>
	</header>
);

// export default Header;
export default translate("App")(Header);