
class UserDecorator
  include ActionView::Helpers::DateHelper

  attr_reader :user

  def initialize(user)
    @user = user
  end

  def simple_decorate
    {
      :programs => programs,
      :city => city,
      :client => client,
      :volunteer => volunteer,
      :email => email,
      :url_slug => url_slug,
      :first_name => first_name,
      :last_logged_in => last_logged_in,
      :thumbnail_image => picture,
      :timezone => timezone
    }.merge(availabilities_hash)
  end

  def availabilities_hash
    unless volunteer
      {
          :available_days => available_days,
          :availabilities => availabilities
      }
    end

    { }
  end

  def decorate
    {
        :programs => programs,
        :address => address,
        :city => city,
        :url_slug => url_slug,
        :client => client,
        :volunteer => volunteer,
        :email => email,
        :first_name => first_name,
        :last_logged_in => last_logged_in,
        :thumbnail_image => picture,
        :description => description,
        :timezone => timezone
    }.merge(availabilities_hash)
  end

  def timezone
    user.timezone
  end

  def description
    user.description ||= ''
  end

  def url_slug
    user.url_slug
  end

  def first_name
    user.first_name
  end

  def email
    user.email
  end

  def picture
    if Rails.env.production?
      URI.join('https:' + user.thumbnail_image.url(:thumbnail)).to_s
    else
      URI.join(Rails.configuration.static_base_url, user.thumbnail_image.url(:thumbnail)).to_s
    end
  end

  def availabilities
    user.availabilities.collect{ |n| AvailabilityDecorator.new(n).decorate }
  end

  def programs
    user.programs.pluck(:name)
  end

  def address
    user.address ||= ''
  end

  def city
    user.city ||= ''
  end

  def client
    @user.client?
  end

  def volunteer
    @user.volunteer?
  end

  def available_days
    availabilities.pluck(:day)
  end

  def last_logged_in
    time_ago_in_words(user.last_sign_in_at)
  end
end
