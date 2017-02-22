class Klass < ApplicationRecord
	belongs_to :tutor
	has_one :schedule, dependent: :destroy

	after_initialize :ensure_schedule

	NAMES = %w(Citizenship English)

	validates :category, :schedule, :tutor, presence: true
	validates :category, inclusion: {in: NAMES}

	def self.seed
		Klass.new ({
			category: ["Citizenship", "English"].sample,
			title: ["Intro", "Level II"].sample,
			language: ["English", "Spanish"].sample
		})
	end

	private

	def ensure_schedule
		self.schedule ||= Schedule.new
	end



end
