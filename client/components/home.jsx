import React from 'react'
import {translatable} from '../utils/translate'
import {connect} from 'react-redux'

import {setLanguage} from '../actions/language'

const Test = translatable("Home")( ({setLanguage, tr}) => <div onClick={setLanguage}>{tr("test")}</div> )

class Home extends React.Component {
	render(){
		return(
			<div>
				<Test/>
				<Test setLanguage={this.props.setLanguage.bind("english")} language="spanish"/>
			</div>
		);
	}
}

const mapDispatch = ({
	setLanguage
})

export default connect(null, mapDispatch)(Home);