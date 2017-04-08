class Tutor < User
	has_many :klasses, dependent: :destroy
	has_many :schedules, 
		through: :klasses, 
		inverse_of: :tutor, 
		dependent: :destroy

	has_many :taught_languages,
		through: :klasses,
		source: :language

	def set_schedule(schedule = {})
		self.schedule.update(schedule)
	end

	# for testing
	def self.seed
		self.new ({
			email: Faker::Internet.email,
			password: "password",
			first_name: Faker::Name.first_name,
			last_name: Faker::Name.last_name,
			phone_number: Faker::PhoneNumber.phone_number,
			language: ["English", "Spanish"].sample,
			klasses: [Klass.seed, Klass.seed]
		})
	end


end