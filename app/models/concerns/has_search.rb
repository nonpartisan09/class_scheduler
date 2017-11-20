require 'active_support/concern'

module HasSearch
  extend ActiveSupport::Concern

  included do
    def self.search(params)
      paginate(page: 1, per_page: 10)
          .join_tables
          .teaching_course(params[:course])
          .is_available(params)
    end

    scope :join_tables, proc {
      includes(:courses, :roles, :availabilities)
    }

    scope :teaching_course, proc { |course|
      if course.present?
        where({
            :courses => { id: course.split(/,/) },
            :roles => {:url_slug => 'volunteer' }
        })
      end
    }

    scope :is_available, proc { | params |
      start_time_query = if params[:start_time].present?
                            { :start_time => params[:start_time]..DateTime.new(2000,01,01).end_of_day }
                         else
                           {}
                         end

      end_time_query = if params[:end_time].present?
                          { :end_time => DateTime.new(2000,01,01).beginning_of_day..params[:end_time] }
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
