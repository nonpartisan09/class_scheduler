json.extract! klass, :id, :category, :description, :language

json.schedule do 
	json.partial! "api/schedules/schedule", schedule: klass.schedule
end