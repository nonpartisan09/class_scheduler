class AvailabilityDecorator
  include ActionView::Helpers::DateHelper
  attr_reader :availability

  def initialize(availability, opts={ })
    @availability, @timezone, @user_timezone = availability, opts[:timezone], opts[:user_timezone]
  end

  def self_decorate
    {
        :day => self_day,
        :start_time => start_time,
        :end_time => end_time,
        :timezone => @user_timezone,
        :id => id
    }
  end

  def decorate
    {
        :day => current_user_day,
        :start_time => start_time,
        :end_time => end_time,
        :timezone => @user_timezone,
        :id => id
    }
  end

  def id
    @availability.id
  end

  def self_day
    @availability.day
  end

  def current_user_day
    Time.zone = @timezone
    Time.zone.local_to_utc(@availability.start_time).strftime("%A")
  end

  def start_time
    Time.zone = @timezone
    Time.zone.parse(@availability.start_time.to_s).strftime("%H:%M")
  end

  def end_time
    Time.zone = @timezone
    Time.zone.parse(@availability.end_time.to_s).strftime("%H:%M")
  end
end
