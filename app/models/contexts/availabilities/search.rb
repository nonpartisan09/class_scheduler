module Contexts
  module Availabilities
    class Search

      def initialize(search_params, current_user)
        @params, @user, @timezone = search_params, current_user, current_user[:timezone]

        @page_number = @params[:page] || 1
      end

      def execute
        unless @params[:program].present?
          raise Contexts::Availabilities::Errors::ProgramMissing, 'Program field is required.'
        end

        unless @params[:day].present?
          raise Contexts::Availabilities::Errors::DayMissing, 'Day field is required.'
        end

        if @params[:order].present?
          case @params[:order]
            when "highest"
              order = { average_rating: :desc }
            when "newest"
              order = { created_at: :desc }
            when "closest"
              order = { :order => false }
            when 'last'
              order = { last_sign_in_at: :desc }
          else
            raise Contexts::Availabilities::Errors::IncorrectOrder, 'Selected order is not allowed.'
          end
        else
          order = { last_sign_in_at: :desc }
        end

        if @params[:distance].present? && @user.full_address.present?
          @existing_volunteers = User.search(@params, @timezone)
                                   .near(@user.full_address, @params[:distance], :order => false)
                                   .paginate(:page => @page_number, :per_page => 6)
                                   .order(order)

        else
          @existing_volunteers = User.search(@params, @timezone)
                                   .paginate(:page => @page_number, :per_page => 6)
                                   .order(order)
        end

      end
    end
  end
end
