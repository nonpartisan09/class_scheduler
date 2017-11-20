module Contexts
  module Availabilities
    class Search

      def initialize(search_params, current_user)
        @params, @user = search_params, current_user
      end

      def execute
        unless @params[:course].present?
          raise Contexts::Availabilities::Errors::CourseMissing, 'Course field is required.'
        end

        unless @params[:day].present?
          raise Contexts::Availabilities::Errors::DayMissing, 'Day field is required.'
        end

        if @params[:distance].present?
          @existing_teachers = User.search(@params)
                                   .near(@user.full_address, @params[:distance], :order => false)
                                   .order(last_sign_in_at: :desc)

        else
          @existing_teachers = User.search(@params)
                                   .order(last_sign_in_at: :desc)
        end

      end
    end
  end
end
