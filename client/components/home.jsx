import React from 'react'
import {translate} from '../utils/translate'
import {Jumbotron, Button} from 'react-bootstrap'
import Highlight from './highlight'

class Home extends React.Component {
	render(){
		const {tr} = this.props

		const billboardBody = <h3>{tr("billboard_text")}</h3>
		const howItWorksBody = <p>{tr("how_it_works_text")}</p>
		const aboutUsBody = <p>{tr("about_us_text")}</p>

		return(
			<section id="home">
			  <Jumbotron>
			    <h1>{tr("billboard_title")}</h1>
			    <p>{tr("billboard_text")}</p>
			    <p><Button bsStyle="primary">{tr("find_classes")}</Button></p>
			  </Jumbotron>
				<main>
					<Highlight
						img=""
						title={tr("how_it_works_title")}
						body={howItWorksBody}/>
					<Highlight
						img=""
						title={tr("about_us_title")}
						body={aboutUsBody}
						dir="right" />
				</main>
			</section>
		);
	}
}

export default translate("Home")(Home);