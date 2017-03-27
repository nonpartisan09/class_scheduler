class Language < ApplicationRecord
  belongs_to :owner, polymorphic: true
end
