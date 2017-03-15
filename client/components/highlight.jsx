import React from 'react'

const Highlight = ({title, body, img, dir="left"}) => (
	<section className={`highlight ${dir}`}>

		<figure className="highlight-thumb">
			<img className="highlight-img" src={img}/>
		</figure>
		<div className="highlight-content">	
			<h2>{title}</h2>
			{body}
		</div>

	</section>
)

export default Highlight;