class Schedule < ApplicationRecord
	belongs_to :klass
	has_one :tutor, through: :klass
	validate :slots

	SLOTS = [ 
		:sun_mor, :sun_aft, :sun_eve, 
		:mon_mor, :mon_aft, :mon_eve, 
		:tue_mor, :tue_aft, :tue_eve, 
		:wed_mor, :wed_aft, :wed_eve, 
		:thu_mor, :thu_aft, :thu_eve, 
		:fri_mor, :fri_aft, :fri_eve, 
		:sat_mor, :sat_aft, :sat_eve,
	]

	private 

	def slots
		if SLOTS.all? { |slot| self[slot] == false }
			self.errors.add(:availability, "must have at last one open slot")
		end
	end


end
