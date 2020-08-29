module AvailabilityTimesGenerator
  extend ActiveSupport::Concern

  class ValidAvailabilityTimes
    def initialize(timezone)
      @timezone = timezone
      @current_day = Time.now.in_time_zone(timezone)
    end

    def get_time(new_hour, new_minute)
      @current_day.change({hour: new_hour, min: new_minute})
    end

    def generate_availability_times(last_hour, last_minute)
      first_hour = 0
      first_minute = 0
      minute_increment = 15

      current_availability = get_time(first_hour, first_minute)
      last_availability = get_time(last_hour, last_minute)
  
      availabilities = {}
      while current_availability.to_i <= last_availability.to_i do
        add_availability_time(availabilities, current_availability)
        current_availability = current_availability + minute_increment.minutes
      end
  
      availabilities
    end

    def add_availability_time(availabilities, new_time)
      hour = new_time.strftime("%H").to_i
      minute = new_time.strftime("%M").to_i
      availabilities[get_formatted_time_label(new_time)] = new_time
    end
    
    def get_formatted_time_label(time)
      time24 = time.strftime("%H:%M")
      time12 = time.strftime("%I:%M %p")
      "#{time24} / #{time12}"
    end
  
    def get_availability_start_time_options
      last_start_hour = 23
      last_start_minute = 30

      generate_availability_times(last_start_hour, last_start_minute)
    end
  
    def get_availability_end_time_options
      last_end_hour = 23
      last_end_minute = 59
  
      availabilities = generate_availability_times(last_end_hour, last_end_minute)
      last_availability = get_time(last_end_hour, last_end_minute)
      add_availability_time(availabilities, last_availability)

      availabilities
    end

  end

end