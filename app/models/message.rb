class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :user
  after_create :queue_response_check

  default_scope { order(created_at: :desc) }

  scope :unread, -> { where(unread: true) }

  validates :body, presence: true

  def queue_response_check
    recipient = conversation.recipient

    if recipient.volunteer?
      recipient.audit_conversations
      recipient.delay(run_at: 2.days.from_now).audit_conversation(conversation)
    end
  end
end
