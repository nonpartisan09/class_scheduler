class Role < ActiveRecord::Base
  include HasUrl
  has_and_belongs_to_many :users

  validates :name, :url_slug, presence: true, uniqueness: true
end
