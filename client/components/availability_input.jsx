import React from 'react'
import {translate} from '../utils/translate'
import {Slots, Days} from '../utils/availability'

const DayToggle = ({label, onClick, on})=> {
	const availClass = on ? "available" : "unavailable"
	return (
		<div className={`day-toggle ${availClass}`} onClick={onClick}>
			{label}
		</div>
	)
}

const DayGrouping = ({day, toggleHandler, state, tr}) => {
	const slots = Slots.filter(slot => slot.includes(day))
	const toggles = slots.map(slot => (
			<DayToggle 
				key={slot}
				label={tr(slot)} 
				onClick={toggleHandler(slot)}
				on={state[slot]}
			/>
		)
	)
	return (
		<div className={`day-grouping ${day}`}>
			{toggles}
		</div>
	)
}


class AvailabilityInput extends React.Component {
	constructor(){
		super()
		this.state = {}
		Slots.forEach(slot => {
			this.state[slot] = false
		})
		this.toggleHandler = this.toggleHandler.bind(this);
	}
	toggleHandler(slot){
		return () => this.setState({[slot]: !this.state[slot]}, ()=> {
			this.props.onChange({
				preventDefault: ()=>{},
				currentTarget: {value: this.state}
			});
		})
	}
	render(){
		const {tr} = this.props;
		const days = Days.map(day => (
			<DayGrouping
				key={day}
				day={day}
				toggleHandler={this.toggleHandler}
				state={this.state}
				tr={tr}
			/>
		))
		return (
			<div className="availability-input">
				{days}
			</div>
		)
	}
}

export default translate("Classes")(AvailabilityInput);