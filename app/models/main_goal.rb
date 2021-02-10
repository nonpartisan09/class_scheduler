class MainGoal < ApplicationRecord
  has_many :user_main_goals
  has_many :users, through: :user_main_goals

  validates :name, presence: true

  scope :displayable, -> { where({:displayable => true}) }
  scope :volunteer_options, -> { where({:for_volunteer => true, :displayable => true}) }
  scope :client_options, -> { where({:for_client => true, :displayable => true}) }

  def type
    if for_volunteer
      'volunteer: '
    else
      'client: '
    end
  end
end
