import Dictionaries from '../translations'

import {connect} from 'react-redux'
import React from 'react'

export const translate = dict => component => {

	const translate = lang => tag =>  {
		let result
		try {
			result = Dictionaries[dict][tag][lang]
		} catch (err) {
			console.error(`Couldn't translate dict: ${dict}, lang: ${lang}, tag: ${tag}`)
		}
		return result
	}

	const mapState = ({language}, ownProps) => {
		language = ownProps.language || language.default;
		const tr = translate(language);

		return { language, tr }
	}


	return connect(mapState)(component)
}