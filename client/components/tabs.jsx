import React from 'react';
import {Link} from 'react-router';

class Tabs extends React.Component {
	constructor(){
		super()
	}
	render() {
		const {tabs} = this.props;
		const htmlTabs = tabs.map(({name, path}, i) => {
			const active = location.hash.match(path) ? "active" : ""
			return (
				<Link
					to={`volunteer/${path}`}
					key={`${name}-${path}=${i}`} 
					className={`tab ${active}`}
					>
					<span>{name}</span>
				</Link>
			)
		})
		return (
			<nav className="tabs">
				{htmlTabs}
			</nav>
		);
	}
}

export default Tabs;