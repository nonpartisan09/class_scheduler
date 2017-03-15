import React from 'react'
import {translate} from '../utils/translate'

const Billboard = ({language, title, body, backgroundImg}) => (
	<section id="billboard" className="column" style={{backgroundImg}}>
		<h1>{title}</h1>
		{body}
	</section>
)


export default Billboard;