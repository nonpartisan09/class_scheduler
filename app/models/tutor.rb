class Tutor < User
	has_one :schedule, dependent: :destroy
	after_initialize :ensure_schedule

	def set_schedule(schedule = {})
		self.schedule.update(schedule)
	end

	def self.by_availability(schedule = {})
		Tutor.joins(:schedule).where(schedules: schedule)
	end

	# for testing
	def self.seed
		self.new ({
			email: Faker::Internet.email,
			password: "password",
			f_name: Faker::Name.first_name,
			l_name: Faker::Name.last_name,
			phone_number: Faker::PhoneNumber.phone_number,
			language: ["English", "Spanish"].sample
		})
	end

	private

	def ensure_schedule
		self.schedule = Schedule.new
	end

end