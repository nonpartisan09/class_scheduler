class Klass < ApplicationRecord

	attr_accessor :availability

	belongs_to :tutor
	has_one :schedule, dependent: :destroy, autosave: true
	has_one :language, 
		as: :owner,
		dependent: :destroy

	after_initialize :ensure_schedule

	CATEGORIES = ["naturalization", "english", "legal"]

	validates :category, :language, :schedule, :tutor, presence: true
	validates :category, inclusion: {in: CATEGORIES}
	validates :description, length: {maximum: 140}
	validates :title, length: {maximum: 60}

	def self.seed
		Klass.new ({
			category: CATEGORIES.sample,
			title: ["Intro", "Level II"].sample,
			description: Faker::Lorem.paragraph,
			language: LANGUAGES.sample,
			schedule: Schedule.random
		})
	end

	def availability= avail
		@availability = avail
		self.schedule = Schedule.new(@availability)
	end

	# def language=(language)
 #    write_attribute(:language, Language.new(language: language, owner: self))
 #  end

	private

	def ensure_schedule
		self.schedule ||= Schedule.new()
	end

end
