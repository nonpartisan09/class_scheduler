class Suspension < ApplicationRecord
  validates :user_id, uniqueness: true
  belongs_to :user, class_name: 'User'
end