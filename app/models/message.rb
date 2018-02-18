class Message < ApplicationRecord
  belongs_to :conversation, dependent: :destroy
  belongs_to :user

  default_scope { order(created_at: :desc) }

  scope :unread, -> { where(unread: true) }

  validates :body, presence: true
end
