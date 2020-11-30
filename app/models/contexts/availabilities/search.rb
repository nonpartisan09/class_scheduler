module Contexts
  module Availabilities
    class Search

      def initialize(search_params, current_user)
        @current_user, @timezone = current_user, current_user[:timezone]
        @params = formatTimeParams(search_params)
      end

      def execute
        unless @params[:program].present?
          message = I18n.t('custom_errors.messages.missing_program')
          raise Contexts::Availabilities::Errors::ProgramMissing, message
        end

        unless @params[:language].present?
          message = I18n.t('custom_errors.messages.missing_language')
          raise Contexts::Availabilities::Errors::LanguageMissing, message
        end

        unless @params[:day].present?
          message = I18n.t('custom_errors.messages.missing_day')
          raise Contexts::Availabilities::Errors::DayMissing, message
        end

        @existing_volunteers = User.search(@params, @timezone, @current_user.full_address)
      end

      def formatTimeParams(params)
        if(params[:start_time])
          params[:start_time] = getDateTime(params[:start_time])
        end
        if(params[:end_time])
          params[:end_time] = getDateTime(params[:end_time])
        end
        params
      end

      def getDateTime(time)
        values = time.split(":").map(&:to_i)
        hour = values[0]
        minute = values[1]
        Time.zone = @timezone
        Time.now.change(hour: hour, min: minute)
      end
    end
  end
end
