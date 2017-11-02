class AvailabilityDecorator
  include ActionView::Helpers::DateHelper
  attr_reader :availability


  def initialize(availability)
    @availability = availability
  end

  def decorate
    {
        :day => day,
        :start_time => start_time,
        :end_time => end_time,
        :timezone => timezone,
    }
  end

  def day
    availability.day
  end

  def timezone
    availability.timezone
  end

  def start_time
    availability.start_time.strftime("%H:%M")
  end

  def end_time
    availability.end_time.strftime("%H:%M")
  end
end
