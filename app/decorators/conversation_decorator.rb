class ConversationDecorator
  include ActionView::Helpers::DateHelper
  attr_reader :conversation

  def initialize(conversation)
    @conversation = conversation
  end

  def decorate
    {
        :recipient => recipient_name,
        :sender => sender_name,
        :messages => messages,
        :recipient_avatar => recipient_avatar,
        :sender_avatar => sender_avatar,
        :sender_url_slug => sender_url_slug,
        :recipient_url_slug => recipient_url_slug
    }
  end

  def author
    @author ||= User.find(@conversation.author_id)
  end

  def recipient
    @recipient ||= User.find(@conversation.author_id)
  end

  def sender_url_slug
    author.url_slug
  end

  def recipient_url_slug
    recipient.url_slug
  end

  def sender_name
    author.first_name
  end

  def recipient_name
    recipient.first_name
  end

  def recipient_avatar
    picture(recipient.thumbnail_image)
  end

  def sender_avatar
    picture(author.thumbnail_image)
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
    @conversation.messages.collect{ |message| MessageDecorator.new(message).decorate }
  end
end
