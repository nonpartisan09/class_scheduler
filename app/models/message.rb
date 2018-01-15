class Message < ApplicationRecord
  belongs_to :conversation, dependent: :destroy
  belongs_to :user

  validates :body, presence: true
end
