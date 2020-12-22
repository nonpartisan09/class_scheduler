module AvailabilitiesSorter
    extend ActiveSupport::Concern

    def sort_availabilities(availabilities_unsorted)
        availabilities_unsorted.sort_by { 
          |availability| [ I18n.t('date.day_names').index(availability[:day]), availability[:start_time] ] 
        }
    end
end