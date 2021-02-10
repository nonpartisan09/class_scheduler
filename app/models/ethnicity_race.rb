class EthnicityRace < ApplicationRecord
  has_many :users_ethnicity_races
  has_many :users, through: :users_ethnicity_races

  validates :name, presence: true

  scope :displayable, -> { where({:displayable => true}) }
end
