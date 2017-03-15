import React from 'react'
import {translate} from '../utils/translate'

import Billboard from './billboard'
import Highlight from './highlight'

class Home extends React.Component {
	render(){
		const {tr} = this.props

		const billboardBody = <h3>{tr("billboard_text")}</h3>
		const howItWorksBody = <p>{tr("how_it_works_text")}</p>
		const aboutUsBody = <p>{tr("about_us_text")}</p>

		return(
			<section id="home">
				<Billboard 
					title={tr("billboard_title")} 
					body={billboardBody}
				/>
				<Highlight
					img=""
					title={tr("how_it_works_title")}
					body={howItWorksBody}/>
				<Highlight
					img=""
					title={tr("about_us_title")}
					body={aboutUsBody}
					dir="right" />
			</section>
		);
	}
}

export default translate("Home")(Home);