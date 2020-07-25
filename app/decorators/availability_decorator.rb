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
  
  def get_time(time)
    Time.zone = @timezone
  
    current_time = Time.zone.now 
    offset = current_time.utc_offset/3600
     
    user_time = ActiveSupport::TimeZone[offset].parse(time.to_s)
    user_time.strftime("%H:%M") + ' ' + Time.zone.now.zone
  end 
  
  def start_time
    @start_time || get_time(@availability.start_time)
  end

  def end_time
    @end_time || get_time(@availability.end_time)
  end
end
