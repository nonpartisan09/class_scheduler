module AvailabilitiesSorter
    extend ActiveSupport::Concern

    def sort_availabilities(availabilities_unsorted)
        availabilities = availabilities_unsorted.sort_by { 
          |availability| [ get_day_value(availability[:day]), availability[:start_time] ] 
        }
    end

    def get_day_value(day) 
        case day
        when "Monday"
          0
        when "Tuesday"
          1
        when "Wednesday"
          2
        when "Thursday"
          3
        when "Friday"
          4
        when "Saturday"
          5
        when "Sunday"
          6
        end                            
      end

end