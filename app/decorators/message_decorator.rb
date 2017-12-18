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
    }
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

  def sent_on
    @message.created_at.strftime("%D %H:%M")
  end
end
