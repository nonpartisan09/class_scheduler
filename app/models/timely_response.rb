class TimelyResponse < ApplicationRecord
    # Whenever a user has an associated record in the timely response table,
    # that means that they did not respond to a client inquiry within the
    # required 48 hour window.
    
    # This was renamed TimelyResponse from "Suspension" due to a request from management.

    validates :user_id, presence: true
    belongs_to :user, class_name: 'User'
end
