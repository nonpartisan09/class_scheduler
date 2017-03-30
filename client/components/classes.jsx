import React from 'react'
import {connect} from 'react-redux'
import {translate} from '../utils/translate'
import {Link} from 'react-router'
import ClassList from './class_list'

class Classes extends React.Component {
	render(){
		const {user: {classes_taught }} = this.props

		return(
			<main>
				<Link to="volunteer/classes/new"> Add a new class </Link>
				<ClassList id="volunteer-class-list" klasses={classes_taught} editable={true}/>
			</main>
		);
	}
}

const mapState = ({session: {user}}) => ({user})

export default translate("Classes")(connect(mapState)(Classes));