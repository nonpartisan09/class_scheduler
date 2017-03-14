import React from 'react'
import {translatable} from '../utils/translate'
import {connect} from 'react-redux'


let Test = translatable("Home")( ({tr}) => <div>{tr("test")}</div> )

class Home extends React.Component {
	render(){
		return(
			<div>
				<Test/>
				<Test language="spanish"/>
			</div>
		);
	}
}


export default Home;