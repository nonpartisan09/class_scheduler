import React from 'react'
import {translate} from '../utils/translate'
import {Slots} from '../utils/availability'
import {Link} from 'react-router'

const availabilityString = (tr, availability) => {
	return Slots.filter(slot => availability[slot]
	).map(slot => tr(slot)).join(", ")
}

const ListItem = ({listId, klass, editable, tr}) => {
	let edit_button
	if (editable) {
		edit_button = <Link className="button" to={`volunteer/classes/edit/${klass.id}`}>{tr("edit")}</Link>
	}

	return (
		<li className={`${listId}-item class-list-item`}>
			<div className={`class-thumbnail ${klass.category}`}>
				<h3>{klass.title}</h3>
				<p className={"quiet category"}>{tr(klass.category)}</p>
				<p className="quiet">{klass.description}</p>
				<p className="quiet">{availabilityString(tr, klass.availability)}</p>
				{edit_button}
			</div>
		</li>
	)
}

export default translate("Classes")(ListItem);