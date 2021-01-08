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
        :id => id,
        :start_time_12_hour =>  time_12_hour(@availability.start_time),
        :end_time_12_hour => time_12_hour(@availability.end_time)
    }
  end

  def decorate
    {
        :day => current_user_day,
        :start_time => start_time,
        :end_time => end_time,
        :start_time_12_hour =>  time_12_hour(@availability.start_time),
        :end_time_12_hour => time_12_hour(@availability.end_time),
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
    @day ||= AvailabilityDecorator.parse_time_users_offset(@availability.start_time, @timezone).strftime("%A")
  end

  def self.parse_time_users_offset(time, timezone)
    Time.zone = timezone
  
    current_time = Time.zone.now 
    offset = current_time.utc_offset/3600
    
    ActiveSupport::TimeZone[offset].parse(time.to_s)
  end
 
  def get_time(time)
    user_time = AvailabilityDecorator.parse_time_users_offset(time, @timezone)
    user_time.strftime("%H:%M") + ' ' + Time.zone.now.zone
  end 
  
  def start_time
    @start_time || get_time(@availability.start_time)
  end

  def end_time
    @end_time || get_time(@availability.end_time)
  end

  def time_12_hour(time)
    user_time = AvailabilityDecorator.parse_time_users_offset(time, @timezone)
    user_time.strftime("%I:%M %p") + ' ' + Time.zone.now.zone
  end
end
