json.extract! tutor, :id, :f_name, :l_name, :profile_src
json.classes do
	json.array! tutor.klasses do |klass|
		json.partial! "api/klasses/klass", klass: klass
	end
end