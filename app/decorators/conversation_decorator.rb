class ConversationDecorator
  include ActionView::Helpers::DateHelper
  attr_reader :conversation

  def initialize(conversation, current_user)
    @conversation, @current_user = conversation, current_user
  end

  def simple_decorate
    {
        :conversee_avatar => conversee_avatar,
        :id => id,
        :is_first_message_unread => is_first_message_unread,
        :conversee => conversee,
        :is_timely => conversation.is_timely?
    }
  end

  def decorate
    {
        :conversee => conversee,
        :messages => messages,
        :id => id,
        :is_first_message_unread => is_first_message_unread,
        :conversee_avatar => conversee_avatar,
        :conversee_url_slug => conversee_url_slug,
        :is_timely => conversation.is_timely?
    }
  end

  def conversee_url_slug
    if @current_user.id != @conversation.author_id
      sender_url_slug
    else
      recipient_url_slug
    end
  end

  def conversee
    if @current_user.id != @conversation.author_id
      sender_name
    else
      recipient_name
    end
  end

  def conversee_avatar
    if @current_user.id != @conversation.author_id
      sender_avatar
    else
      recipient_avatar
    end
  end


  def id
    @conversation.id
  end

  def author
    User.where(:id => @conversation.author_id).first || nil
  end

  def recipient
    User.where(:id => @conversation.recipient_id).first || nil
  end

  def sender_url_slug
    author.url_slug unless author.nil?
  end

  def recipient_url_slug
    recipient.url_slug unless recipient.nil?
  end

  def sender_name
   if author.nil?
     "Deleted User"
   else
     author.first_name
   end
  end

  def recipient_name
    if author.nil?
      "Deleted User"
    else
      recipient.first_name
    end
  end

  def recipient_avatar
    picture(recipient.thumbnail_image) unless recipient.nil?
  end

  def sender_avatar
    picture(author.thumbnail_image) unless author.nil?
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

  def messages
    @conversation.messages.collect{ |message| MessageDecorator.new(message, @current_user).decorate }
  end

  def is_first_message_unread
    latest_message.unread && @current_user.id != latest_message.user_id
  end

  def latest_message
    @conversation.messages.first
  end
end
