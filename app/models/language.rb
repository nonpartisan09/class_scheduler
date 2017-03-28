class Language < ApplicationRecord
	ALL = ["eng", "spa"]
  belongs_to :owner, polymorphic: true
end
