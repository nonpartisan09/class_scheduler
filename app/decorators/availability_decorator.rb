class AvailabilityDecorator
  include ActionView::Helpers::DateHelper
  attr_reader :availability

  def initialize(availability, opts={ })
    @availability = availability
    @timezone = opts[:timezone]
    @user_timezone = opts[:user_timezone]
    @start_time = opts[:start_time]
    @end_time = opts[:end_time]
    @day = opts[:day]
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
    @day ||= Time.zone.local_to_utc(@availability.start_time).strftime("%A")
  end

  def start_time
    Time.zone = @timezone
    @start_time || Time.zone.parse(@availability.start_time.to_s).strftime("%H:%M")
  end

  def end_time
    Time.zone = @timezone
    @end_time || Time.zone.parse(@availability.end_time.to_s).strftime("%H:%M")
  end
end
