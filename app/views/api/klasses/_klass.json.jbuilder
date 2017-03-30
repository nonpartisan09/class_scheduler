json.extract! klass, :id, :category, :description, :language, :title

json.availability do 
	json.partial! "api/schedules/schedule", schedule: klass.schedule
end