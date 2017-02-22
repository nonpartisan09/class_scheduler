class Schedule < ApplicationRecord
	belongs_to :tutor

	def self.random
		sched = self.new
		sched.attributes.keys.each do |attr|
			next if %w(id tutor_id created_at, updated_at).include?(attr)
			sched[attr] = rand(2) == 1
		end

		sched
	end
end
