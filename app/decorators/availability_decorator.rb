class AvailabilityDecorator
  include ActionView::Helpers::DateHelper
  attr_reader :availability

  def initialize(availability, timezone)
    @availability, @timezone = availability, timezone
  end

  def decorate
    {
        :day => day,
        :start_time => start_time,
        :end_time => end_time,
        :timezone => @timezone,
        :id => id
    }
  end

  def id
    @availability.id
  end

  def day
    @availability.day
  end

  def start_time
    @availability.start_time.in_time_zone(@timezone).strftime("%H:%M")
  end

  def end_time
    @availability.end_time.in_time_zone(@timezone).strftime("%H:%M")
  end
end
