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
      includes(:programs, :availabilities)
    }

    scope :who_can_help_with, proc { |program|
      if program.present?
        volunteers.active.with_availabilities.where({
            :programs => { id: program.split(/,/) }
        })
      else
        message = I18n.t('custom_errors.messages.missing_program')
        raise Contexts::Availabilities::Errors::ProgramMissing, message
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

        Time.zone = timezone
        start_time = params[:start_time] || '00:00'
        end_time = params[:end_time]  || '23:59'

        queries = []
        days.each { |day|
          day_month = "#{I18n.t('date.day_names')[day.to_i]}, #{day.to_i + 1} Jan 2001"
          start_of_day = Time.zone.parse("#{day_month} 00:00 #{Time.zone.tzinfo}").iso8601
          end_of_day = Time.zone.parse("#{day_month} 23:59 #{Time.zone.tzinfo}").iso8601
          start_query = Time.zone.parse("#{day_month} #{start_time} #{Time.zone.tzinfo}").iso8601
          end_query = Time.zone.parse("#{day_month} #{end_time} #{Time.zone.tzinfo}").iso8601

          statement = where({ :availabilities => {
              :start_time => start_of_day..end_query,
              :end_time => start_query..end_of_day
          }})

          queries << statement
        }

        queries.inject(:or)
      else
        message = I18n.t('custom_errors.messages.missing_day')
        raise Contexts::Availabilities::Errors::DayMissing, message
      end
    }
  end

  module ClassMethods

  end
end
