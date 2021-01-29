class UsersMeetingOption < ApplicationRecord
  belongs_to :user
  belongs_to :meeting_option
end
