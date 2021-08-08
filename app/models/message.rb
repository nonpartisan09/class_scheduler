class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :user
  after_create :update_responsiveness

  default_scope { order(created_at: :desc) }

  scope :unread, -> { where(unread: true) }

  validates :body, presence: true

  def update_responsiveness
    if self.user.unresponsive? && !self.conversation.timely?
      self.user.update(unresponsive: false)
      self.conversation.update(timely: true)
    end
  end
end
