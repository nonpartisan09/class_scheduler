import React from 'react'
import {connect} from 'react-redux'
import {translate} from '../utils/translate'
import {Link} from 'react-router'

class Classes extends React.Component {
	render(){
		const {user, children} = this.props
		return(
			<main>
				<Link 
					className="button"
					to="volunteer/classes/new">
					Add a new class
				</Link>
				{children}
				<div>Below</div>
			</main>
		);
	}
}

const mapState = ({session: {user}}) => ({user})

export default translate("Classes")(connect(mapState)(Classes));