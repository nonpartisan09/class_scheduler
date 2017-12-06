module Contexts
  module Availabilities
    class Search

      def initialize(search_params, current_user)
        @params, @user, @timezone = search_params, current_user, current_user[:timezone]
      end

      def execute
        unless @params[:program].present?
          raise Contexts::Availabilities::Errors::ProgramMissing, 'Program field is required.'
        end

        unless @params[:day].present?
          raise Contexts::Availabilities::Errors::DayMissing, 'Day field is required.'
        end

        if @params[:distance].present?
          @existing_volunteers = User.search(@params, @timezone)
                                   .near(@user.full_address, @params[:distance], :order => false)
                                   .order(last_sign_in_at: :desc)

        else
          @existing_volunteers = User.search(@params, @timezone)
                                   .order(last_sign_in_at: :desc)
        end

      end
    end
  end
end
