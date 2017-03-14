import Home from '../translations/home'
import {connect} from 'react-redux'
import React from 'react'
if (typeof window.localStorage.language === 'undefined') window.localStorage.language = "english";

const dictionaries = {
	Home
}

class Translator {
	constructor(dict, defaultLang) {
		this.dict = dictionaries[dict];
		this.defaultLang = defaultLang;
		return this.translate.bind(this);
	}

	translate(tag, lang = this.defaultLang) {
		return this.dict[lang][tag];
	}
}

export const translatable = dict => component => {
	const mapState = ({language}, ownProps) => ({language: ownProps.language || language.default})
	class Translatable extends React.Component {
		render(){
			return React.createElement(component, Object.assign(
				{tr: new Translator(dict, this.props.language)}, 
				this.props)
			)
		}
	}
	return connect(mapState)( Translatable )
}