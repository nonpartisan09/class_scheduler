module Contexts
  module Availabilities
    class Search

      def initialize(search_params, current_user)
        @params, @current_user, @timezone = search_params, current_user, current_user[:timezone]
      end

      def execute
        unless @params[:program].present?
          raise Contexts::Availabilities::Errors::ProgramMissing, 'Program field is required.'
        end

        unless @params[:day].present?
          raise Contexts::Availabilities::Errors::DayMissing, 'Day field is required.'
        end

        @existing_volunteers = User.search(@params, @timezone, @current_user.full_address)
      end
    end
  end
end
