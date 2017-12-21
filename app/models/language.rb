class Language < ApplicationRecord
  include HasUrlSlug

  has_and_belongs_to_many :users
end
