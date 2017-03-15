import Home from '../translations/home'
import App from '../translations/app'

import {connect} from 'react-redux'
import React from 'react'

if (!window.localStorage.language) window.localStorage.language = "eng";

const dictionaries = {
	App,
	Home,
}

class Translator {
	constructor(dict, defaultLang) {
		this.dict = dictionaries[dict];
		this.defaultLang = defaultLang;
		return this.translate.bind(this);
	}

	translate(tag, lang = this.defaultLang) {
		return this.dict[tag][lang] || this.dict[tag]["eng"];
	}
}

export const translate = dict => component => {
	class Translatable extends React.Component {
		render(){
			return React.createElement(component, Object.assign(
				{tr: new Translator(dict, this.props.language)}, 
				this.props)
			)
		}
	}
	const mapState = ({language}, ownProps) => ({language: ownProps.language || language.default})
	const reduxWrapper = connect(mapState)

	return reduxWrapper( Translatable );
}