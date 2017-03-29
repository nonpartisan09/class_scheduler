class Language < ApplicationRecord
	ALL = ["eng", "spa"]
  belongs_to :owner, polymorphic: true, autosave: true

  validates :language, inclusion: {in: ALL}
end
