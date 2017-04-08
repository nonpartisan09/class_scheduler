class Image < ApplicationRecord
	belongs_to :owner, polymorphic: true
end
