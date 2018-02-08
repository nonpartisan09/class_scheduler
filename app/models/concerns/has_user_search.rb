require 'active_support/concern'

module HasUserSearch
  extend ActiveSupport::Concern

  included do
    def self.search(params, timezone, current_full_address)
      join_tables
        .who_can_help_with(params[:program])
        .is_available(params, timezone)
        .based_on_distance(params, current_full_address)
        .paginate_results(params[:page])
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
        near(current_full_address, params[:distance], :order => false)
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
          message = I18n.t('custom_errors.messages.incorrect_order')
          raise Contexts::Availabilities::Errors::IncorrectOrder, message
        end
      else
        order(last_sign_in_at: :desc)
      end
    }

    scope :is_available, proc { | params, timezone |
      if params[:day].present?
        I18n.locale = :en
        days = params[:day].split(/,/)
        days = days.collect { |day| I18n.t('date.day_names')[day.to_i] }

        if params[:start_time].present? || params[:end_time].present?
          Time.zone = timezone
          start_of_day = DateTime.now.beginning_of_day
          end_of_day = DateTime.now.end_of_day

          start_time_query = parsed_start_time = Time.parse(params[:start_time])
                             utc_start_time = Time.zone.local_to_utc(parsed_start_time)
                             if utc_start_time >= start_of_day
                               utc_start_time
                             else
                               start_of_day
                             end

          end_time_query =   parsed_end_time = Time.parse(params[:end_time])
                             Time.zone = timezone
                             utc_end_time = Time.zone.local_to_utc(parsed_end_time)
                             if utc_end_time <= end_of_day
                               utc_end_time
                              else
                                end_of_day
                              end

          if params[:start_time].present? && params[:end_time].present?
            time_hash = {
                            :start_time => start_time_query..end_time_query,
                            :end_time => end_time_query..end_of_day
                        }
          elsif params[:start_time].present?
            time_hash = {
                            :start_time => start_time_query..end_time_query,
                        }
          elsif params[:end_time].present?
            time_hash = {
                            :end_time => end_time_query..end_of_day
                        }
          end

          search_hash = { :day => days }.merge(time_hash)
          where({ :availabilities => search_hash })
        else
          where({ :availabilities => { :day => days } })
        end
      else
        message = I18n.t('custom_errors.messages.missing_day')
        raise Contexts::Availabilities::Errors::DayMissing, message
      end
    }
  end

  module ClassMethods

  end
end
