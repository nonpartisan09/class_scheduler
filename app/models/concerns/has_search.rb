require 'active_support/concern'

module HasSearch
  extend ActiveSupport::Concern

  included do
    def self.search(params, timezone)
      paginate(page: 1, per_page: 10)
          .join_tables
          .teaching_program(params[:program])
          .is_available(params, timezone)
    end

    scope :join_tables, proc {
      includes(:programs, :roles, :availabilities)
    }

    scope :teaching_program, proc { |program|
      if program.present?
        where({
            :programs => { id: program.split(/,/) },
            :roles => {:url_slug => 'volunteer' }
        })
      end
    }

    scope :is_available, proc { | params, timezone |
      start_time_query = if params[:start_time].present?
                    parsed_start_time = Time.parse(params[:start_time])
                    start_of_day = DateTime.new(2000,01,01).beginning_of_day
                    Time.zone = timezone
                    utc_start_time = Time.zone.local_to_utc(parsed_start_time).strftime("%H:%M:%S")

                    start_time = if utc_start_time < start_of_day
                                 start_of_day
                               else
                                 utc_start_time
                               end

                    { :start_time => start_time..DateTime.new(2000,01,01).end_of_day }
                  else
                    {}
                  end

      end_time_query = if params[:end_time].present?
                         parsed_end_time = Time.parse(params[:end_time])
                         end_of_day = DateTime.new(2000,01,01).end_of_day
                         Time.zone = timezone
                         utc_end_time = Time.zone.local_to_utc(parsed_end_time).strftime("%H:%M:%S")
                         end_time = if utc_end_time > end_of_day
                                      end_of_day
                                    else
                                      utc_end_time
                                    end
                         { :end_time => DateTime.new(2000,01,01).beginning_of_day..end_time }
                        else
                          {}
                        end

      if params[:day].present?
        where({ :availabilities => {
            :day => params[:day].split(/,/),
        }.merge(start_time_query).merge(end_time_query) })
      else
        raise Contexts::Availabilities::Errors::DayMissing, 'Day field is required.'
      end
    }
  end

  module ClassMethods

  end
end
