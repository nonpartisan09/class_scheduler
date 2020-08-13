class UserDecorator
  include ActionView::Helpers::DateHelper

  attr_reader :user

  def initialize(user)
    @user = user
  end

  def simple_decorate
    {
      :average_rating => average_rating,
      :client => @user.client?,
      :country => country,
      :email => email,
      :first_name => first_name,
      :last_name => last_name,
      :languages => languages,
      :language_ids => language_ids,
      :last_logged_in => last_logged_in,
      :current_sign_in => current_sign_in,
      :locale => locale,
      :phone_number => phone_number,
      :programs => programs,
      :program_ids => program_ids,
      :rating_count => rating_count,
      :state => state,
      :thumbnail_image => picture,
      :timezone => user_timezone,
      :url_slug => url_slug,
      :volunteer => @user.volunteer?,
      :city => city,
      :suspended => @user.suspended?,
      :can_unsuspend => @user.can_unsuspend?,
      :id => @user.id
    }.merge(availabilities_hash)
  end

  def updateable
    {
        :programs => programs,
        :locale => locale,
        :address => address,
        :city => city,
        :country => country,
        :state => state,
        :client => @user.client?,
        :volunteer => @user.volunteer?,
        :email => email,
        :email_notification => email_notification,
        :phone_number => phone_number,
        :first_name => first_name,
        :last_name => last_name,
        :thumbnail_image => picture,
        :description => description,
        :timezone => user_timezone,
        :languages => languages,
        :rating_count => rating_count,
        :average_rating => average_rating,
        :suspended => @user.suspended?,
        :can_unsuspend => @user.can_unsuspend?,
        :id => @user.id
    }
  end

  def availabilities_hash
    if @user.volunteer?
      {
          :available_days => available_days,
      }
    else
      { }
    end
  end

  def decorate
    {
        :address => address,
        :average_rating => average_rating,
        :city => city,
        :client => @user.client?,
        :country => country,
        :description => description,
        :email => email,
        :first_name => first_name,
        :last_name => last_name,
        :how_they_found_us => how_they_found_us,
        :languages => languages,
        :language_ids => language_ids,
        :last_logged_in => last_logged_in,
        :locale => locale,
        :phone_number => phone_number,
        :programs => programs,
        :program_ids => program_ids,
        :rating_count => rating_count,
        :state => state,
        :thumbnail_image => picture,
        :timezone => user_timezone,
        :url_slug => url_slug,
        :volunteer => @user.volunteer?,
        :suspended => @user.suspended?,
        :can_unsuspend => @user.can_unsuspend?,
        :id => @user.id
    }.merge(availabilities_hash)
  end

  def email_notification
    @user.email_notification
  end

  def locale
    @user.locale || 'en'
  end

  def rating_count
    @user.rating_count
  end

  def average_rating
    @user.average_rating
  end

  def languages
    @user.languages.pluck(:name)
  end

  def language_ids
    @user.languages.pluck(:id)
  end

  def user_timezone
    @user.timezone
  end

  def description
    @user.description ||= ''
  end

  def url_slug
    @user.url_slug
  end

  def first_name
    @user.first_name
  end

  def last_name
    @user.last_name
  end

  def email
    @user.email
  end

  def phone_number
    @user.phone_number
  end

  def picture
    if Rails.env.production?
      URI.join('https:' + @user.thumbnail_image.url(:thumbnail)).to_s
    else
      URI.join(Rails.configuration.static_base_url, @user.thumbnail_image.url(:thumbnail)).to_s
    end
  end

  def availabilities
    @user.availabilities
  end

  def programs
    @user.programs.pluck(:name)
  end

  def program_ids
    @user.programs.pluck(:id)
  end

  def address
    @user.address ||= ''
  end

  def city
    @user.city ||= ''
  end

  def country
    @user.country ||= ''
  end

  def state
    @user.state ||= ''
  end

  def how_they_found_us
    @user.how_they_found_us ||= ''
  end

  def available_days
    availabilities.pluck(:day)
  end

  def last_logged_in
    if @user.last_sign_in_at?
      time_ago_in_words(@user.last_sign_in_at)
    else
      nil
    end
  end

  def current_sign_in
    if @user.current_sign_in_at?
      time_ago_in_words(@user.current_sign_in_at)
    else
      nil
    end
  end
end
