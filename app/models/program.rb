class Program < ApplicationRecord
  include HasUrlSlug

  has_many :enrollments
  has_many :users, through: :enrollments
end
