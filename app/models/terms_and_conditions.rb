class TermsAndConditions < ActiveRecord::Base
  validates :version, presence: true, uniqueness: true
end
