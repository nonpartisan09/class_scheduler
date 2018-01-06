class TermsAndConditions < ActiveRecord::Base
  validates :version, presence: true
  validates_uniqueness_of :version
end
