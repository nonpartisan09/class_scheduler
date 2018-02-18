class MessageDecorator
  include ActionView::Helpers::DateHelper
  attr_reader :message

  def initialize(message, current_user={ })
    @message = message
    @current_user = current_user
  end

  def decorate
    {
        :subject => subject,
        :body => body,
        :sent_on => sent_on,
        :unread => unread,
        :sender_url_slug => sender_url_slug,
        :sender_avatar => sender_avatar,
        :sender_first_name => sender_first_name
    }
  end

  def sender_first_name
    if is_current_user_sender?
      I18n.translate 'decorators.pronouns'
    else
      sender.first_name
    end
  end

  def sender_avatar
    picture(sender.thumbnail_image) unless sender.nil?
  end

  def sender_url_slug
    sender.url_slug
  end

  def is_current_user_sender?
    @current_user.id == @message.user_id
  end

  def sender
    if is_current_user_sender?
      @current_user
    else
      user = User.where(:id => @message.user_id).first
      if user.present?
        user
      else
        "Deleted User"
      end
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
    @message.unread && !is_current_user_sender?
  end

  def sent_on
    @message.created_at.strftime("%D %H:%M")
  end

  def picture(thumbnail)
    if Rails.env.production?
      if thumbnail.present?
        URI.join('https:' + thumbnail.url(:thumbnail)).to_s
      end
    elsif thumbnail.present?
      URI.join(Rails.configuration.static_base_url, thumbnail.url(:thumbnail)).to_s
    end
  end
end
