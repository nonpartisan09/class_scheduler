class Student < User
	has_one :preferred_language,
		as: :owner,
		class_name: :Language
end
