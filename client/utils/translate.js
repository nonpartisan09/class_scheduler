import Home from '../translations/home'

const dictionaries = {
	Home
}

export class Translator {
	constructor(name, defaultLang) {
		this.dict = dictionaries[name];
		this.defaultLang = defaultLang;
		return this.translate.bind(this);
	}

	translate(tag, lang = this.defaultLang) {
		return this.dict[lang][tag];
	}
}