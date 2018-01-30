module Contexts
  module Availabilities
    class Search

      def initialize(search_params, current_user)
        @params, @current_user, @timezone = search_params, current_user, current_user[:timezone]
      end

      def execute
        unless @params[:program].present?
          message = I18n.translate custom_errors.messages.missing_program
          raise Contexts::Availabilities::Errors::ProgramMissing, message
        end

        unless @params[:day].present?
          message = I18n.translate custom_errors.messages.missing_day
          raise Contexts::Availabilities::Errors::DayMissing, message
        end

        @existing_volunteers = User.search(@params, @timezone, @current_user.full_address)
      end
    end
  end
end
