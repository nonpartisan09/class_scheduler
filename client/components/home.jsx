import React from 'react'
import {translate} from '../utils/translate'

import Billboard from './billboard'

class Home extends React.Component {
	render(){
		const billboardBody = <h3>Find naturalization and English classes that fit your schedule, location, and language requirements.</h3>

		return(
			<Billboard 
				title="Attend FREE Naturalization Classes" 
				body={billboardBody}
			/>
		);
	}
}

export default translate("Home")(Home);