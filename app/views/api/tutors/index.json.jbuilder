json.array! @tutors do |tutor|
	json.partial! 'api/tutors/tutor', locals: {tutor: tutor}
end