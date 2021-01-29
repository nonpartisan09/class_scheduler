class MeetingOption < ApplicationRecord
    has_many :users_meeting_options
    has_many :users, through: :users_meeting_options
  
    validates :name, presence: true
  
    scope :displayable, -> { where({:displayable => true}) }
end
