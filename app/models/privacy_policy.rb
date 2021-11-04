class PrivacyPolicy < ActiveRecord::Base  
  validates :description, :spanish_description, presence: true
  
  self.table_name = 'privacy_policy'
end