class UserDecorator
  include ActionView::Helpers::DateHelper

  attr_reader :user

  def initialize(user)
    @user = user
  end

  def simple_decorate
    {
      :city => city,
      :programs => programs,
      :client => client,
      :volunteer => volunteer,
      :email => email,
      :url_slug => url_slug,
      :first_name => first_name,
      :last_logged_in => last_logged_in,
      :thumbnail_image => picture,
      :timezone => timezone,
      :languages => languages,
      :average_rating => average_rating,
      :rating_count => rating_count
    }.merge(availabilities_hash)
  end

  def availabilities_hash
    if volunteer
      {
          :available_days => available_days,
          :availabilities => availabilities
      }
    else
      { }
    end
  end

  def decorate
    {
        :programs => programs,
        :address => address,
        :city => city,
        :country => country,
        :state => state,
        :url_slug => url_slug,
        :client => client,
        :volunteer => volunteer,
        :email => email,
        :first_name => first_name,
        :last_logged_in => last_logged_in,
        :thumbnail_image => picture,
        :description => description,
        :timezone => timezone,
        :languages => languages,
        :average_rating => average_rating,
        :rating_count => rating_count,
        :ten_last_comments => ten_last_comments
    }.merge(availabilities_hash)
  end

  def rating_count
    user.rating_count || 0
  end

  def average_rating
    user.average_rating || 0
  end

  def languages
    user.languages.pluck(:name)
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

  def country
    user.country ||= ''
  end

  def state
    user.state ||= ''
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

  def ten_last_comments
    user.reviews.last(10).collect{ |review| ReviewDecorator.new(review).comment_decorate }
  end
end
