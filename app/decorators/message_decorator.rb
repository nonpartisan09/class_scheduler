class MessageDecorator
  include ActionView::Helpers::DateHelper
  attr_reader :message

  def initialize(message)
    @message = message
  end

  def decorate
    {
        :subject => subject,
        :body => body,
        :sent_on => sent_on,
        :unread => unread,
        :sender_url_slug => sender
    }
  end

  def sender
    user = User.where(:id => @message.user_id).first

    if user.present?
      user.url_slug
    else
     "Deleted User"
    end
  end

  def id
    @message.id
  end

  def body
    @message.body
  end

  def subject
    @message.subject
  end

  def unread
    @message.unread
  end

  def sent_on
    @message.created_at.strftime("%D %H:%M")
  end
end
