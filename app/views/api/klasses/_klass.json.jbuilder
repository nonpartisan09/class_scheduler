json.id klass.id
json.category klass.category
json.description klass.description
json.schedule do 
	json.partial! "api/schedules/schedule", schedule: klass.schedule
end