json.extract! klass, :id, :category, :description

json.schedule do 
	json.partial! "api/schedules/schedule", schedule: klass.schedule
end

json.language klass.language.language