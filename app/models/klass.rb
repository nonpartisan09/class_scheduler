class Klass < ApplicationRecord
	belongs_to :tutor
	has_one :schedule, dependent: :destroy
	has_one :language, 
		as: :owner,
		dependent: :destroy

	after_initialize :ensure_schedule

	CATEGORIES = ["Citizenship", "English"]
	LANGUAGES = ["English", "Spanish"]

	validates :category, :schedule, :tutor, presence: true
	validates :category, inclusion: {in: CATEGORIES}
	validates :language, inclusion: {in: LANGUAGES}

	def self.seed
		Klass.new ({
			category: CATEGORIES.sample,
			title: ["Intro", "Level II"].sample,
			description: Faker::Lorem.paragraph,
			language: LANGUAGES.sample,
			schedule: Schedule.random
		})
	end

	private

	def ensure_schedule
		self.schedule ||= Schedule.new
	end



end
