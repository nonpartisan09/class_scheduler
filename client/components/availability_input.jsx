import React from 'react'
import {translate} from '../utils/translate'
import {Slots, Days, Capitalize} from '../utils/availability'

const DayToggle = ({label, onClick, on})=> {
	return (
		<td>
			<input 
				type="checkbox" 
				checked={on} 
				onClick={onClick}
			/>
		</td>
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
		<tr className={"day-grouping"}>
			<td className="day-name">{Capitalize(day)}</td>
			{toggles}
		</tr>
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
				<table className="slot-labels">
					<tbody>
						<tr>
							<th className="slot-label">Day</th>
							<th className="slot-label">Morning</th>
							<th className="slot-label">Afternoon</th>
							<th className="slot-label">Evening</th>
						</tr>
						{days}
					</tbody>
				</table>
			</div>
		)
	}
}

export default translate("Classes")(AvailabilityInput);