class Image < ApplicationRecord
	belongs_to :owner, polymorphic: true
	validates :public_id, presence: true
end
