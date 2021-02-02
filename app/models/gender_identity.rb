class GenderIdentity < ApplicationRecord
  has_many :user_gender_identities
  has_many :users, through: :user_gender_identities

  validates :name, presence: true

  scope :displayable, -> { where({:displayable => true}) }

end
