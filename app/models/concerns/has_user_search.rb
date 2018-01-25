require 'active_support/concern'

module HasUserSearch
  extend ActiveSupport::Concern

  included do
    def self.search(params, timezone, current_full_address)
      join_tables
        .who_can_help_with(params[:program])
        .is_available(params, timezone)
        .paginate_results(params[:page])
        .based_on_distance(params, current_full_address)
        .by_order(params, current_full_address)
    end

    scope :join_tables, proc {
      includes(:programs, :roles, :availabilities)
    }

    scope :who_can_help_with, proc { |program|
      if program.present?
        where({
            :programs => { id: program.split(/,/) },
            :roles => {:url_slug => 'volunteer' },
            :active => true
        })
      end
    }

    scope :paginate_results, proc { |page|
      if page.present?
        paginate(:page => page, :per_page => 6)
      else
        paginate(:page => 1, :per_page => 6)
      end
    }

    scope :based_on_distance, proc { |params, current_full_address|
      if params[:distance].present? && current_full_address.present?
        near(current_full_address, params[:distance], :order => :false)
      end
    }

    scope :by_order, proc { |params, current_full_address|
      if params[:order].present?
        case params[:order]
        when "highest"
          order(average_rating: :desc)
        when "newest"
          order(created_at: :desc)
        when "closest"
          near(current_full_address, 10000, :order => "")
        when 'last'
          order(last_sign_in_at: :desc)
        else
          raise Contexts::Availabilities::Errors::IncorrectOrder, 'Selected order is not allowed.'
        end
      else
        order(last_sign_in_at: :desc)
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
