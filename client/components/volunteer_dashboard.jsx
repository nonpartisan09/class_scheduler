import React from 'react';
import Tabs from './tabs'
import {translate} from '../utils/translate'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'

class VolunteerDashboard extends React.Component {
	constructor(){
		super()
	}
	componentWillMount(){
		if (!this.props.user.id) hashHistory.push("/")
	}
	render() {
		const {tr, children} = this.props;
		return (
			<main>
				<div id="volunteer-dashboard" className="dashboard">
					<Tabs
						tabs = {[
							{name: tr("profile"), path: "profile"},
							{name: tr("classes"), path: "classes"},
							{name: tr("messages"), path: "messages"},
						]}
					/>
					{children}
				</div>
			</main>
		);
	}
}

const mapState = ({session: {user}}) => ({user})

export default connect(mapState)(translate("Dashboard")(VolunteerDashboard));