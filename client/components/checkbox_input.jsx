import React from 'react';
import deepDup from '../utils/deep_dup'

class CheckboxInput extends React.Component {
	constructor(props) {
		super(props)
		this.checked = {}
		props.options.forEach(({value}) => {
			this.checked[value] = false
		})
	}
	componentDidMount () {
		this.props.onChange({
			preventDefault: ()=>{},
			currentTarget: {
				value: deepDup(this.checked)
			}
		})
	}
	handleChange(value){
		return e => {
			this.checked[value] = !this.checked[value]
			this.props.onChange({
				preventDefault: ()=>{},
				currentTarget: {
					value: deepDup(this.checked)
				}
			})

		}
	}
	render() {
	  const {title, options} = this.props;
		const opts = options.map( ({label, value}, i) => {
			return (
				<label key={`${title}-${label}-checkbox-select-input`}>{label}
					<input 
						type="checkbox" 
						name={label} 
						value={value}
						checked={this.checked[value]}
						onChange={this.handleChange(value)}
					/>
				</label>
			);
		})

		return (
		  <div className="checkbox-select">
		  	<h2>{title}</h2>
		  	{ opts }
		  </div>
		)
	}

};


export default CheckboxInput;