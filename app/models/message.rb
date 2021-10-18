class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :user
  after_create :update_responsiveness, :queue_response_check

  default_scope { order(created_at: :desc) }

  scope :unread, -> { where(unread: true) }

  validates :body, presence: true

  def update_responsiveness
    if self.user.unresponsive? || !self.conversation.timely?
      self.user.update(unresponsive: false)
      self.conversation.update(timely: true)
    end
  end

  def queue_response_check
    recipient = conversation.recipient
    recipient.delay(run_at: 2.days.from_now).audit_conversation(conversation)
  end
end
