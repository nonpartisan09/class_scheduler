class Klass < ApplicationRecord

	attr_accessor :availability, :language

	belongs_to :tutor
	has_one :schedule, dependent: :destroy, autosave: true
	has_one :language, 
		as: :owner,
		dependent: :destroy,
		autosave: true

	after_initialize :ensure_schedule, :ensure_language

	CATEGORIES = ["naturalization", "english", "legal"]

	validates :category, :language, :schedule, :tutor, presence: true
	validates :category, inclusion: {in: CATEGORIES}
	validates :description, length: {minimum: 10, maximum: 140}
	validates :title, length: {minimum: 5, maximum: 60}

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

	def language=(lang)
    @language = Language.new(language: lang, owner: self)
  end

	private

	def ensure_schedule
		self.schedule ||= Schedule.new()
	end

	def ensure_language
		self.language ||= Language.new()
	end

end
