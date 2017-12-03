class UserDecorator
  include ActionView::Helpers::DateHelper

  attr_reader :user

  def initialize(user)
    @user = user
  end

  def simple_decorate
    {
      :courses => courses,
      :city => city,
      :client => client,
      :teacher => teacher,
      :email => email,
      :url_slug => url_slug,
      :first_name => first_name,
      :available_days => available_days,
      :availabilities => availabilities,
      :last_logged_in => last_logged_in,
      :thumbnail_image => picture
    }
  end

  def decorate
    {
        :courses => courses,
        :availabilities => availabilities,
        :address => address,
        :city => city,
        :url_slug => url_slug,
        :client => client,
        :teacher => teacher,
        :email => email,
        :first_name => first_name,
        :last_logged_in => last_logged_in,
        :thumbnail_image => picture,
        :description => description
    }
  end

  def description
    user.description
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

  def courses
    user.courses.pluck(:name)
  end

  def address
    user.address
  end

  def city
    user.city
  end

  def client
    @user.client?
  end

  def teacher
    @user.teacher?
  end

  def available_days
    availabilities.pluck(:day)
  end

  def last_logged_in
    time_ago_in_words(user.last_sign_in_at)
  end
end
