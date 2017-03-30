import React from 'react'
import ClassListItem from './class_list_item'

const ClassList = ({id, klasses, editable}) => {
	const content = klasses.map(klass => (
		<ClassListItem 
			key={JSON.stringify(klass)}
			listId={id} editable={editable} klass={klass}/>
	))
			
	return (
		<ul className="class-list" id={id}>
			{content}
		</ul>
	)
}


export default ClassList;