module Contexts
  module Availabilities
    class Search

      def initialize(search_params)
        @params = search_params
      end

      def execute
        if @params[:course]
          if @params[:day].present? || @params[:start_time].present? || @params[:end_time].present?

            if @params[:day] && @params[:start_time] && @params[:end_time]
              @existing_teachers = User.paginate(page: 1, per_page: 10)
                                       .includes(:courses, :roles, :availabilities)
                                       .where({:courses => {:id => @params[:course]}, :roles => {:url_slug => 'volunteer'}, :availabilities => Availability.where('day = ? AND start_time >= ? AND end_time <= ?', @params[:day].split(/,/), @params[:start_time], @params[:end_time]).exists })
                                       .order(last_sign_in_at: :desc)


            elsif @params[:start_time] && @params[:end_time]
              @existing_teachers = User.includes(:courses, :roles, :availabilities)
                                       .paginate(page: 1, per_page: 10)
                                       .where({:courses => {:id => @params[:course]}, :roles => {:url_slug => 'volunteer'}, :availabilities => Availability.where('start_time >= ? AND end_time <= ?', @params[:start_time], @params[:end_time]).exists })
                                       .order(last_sign_in_at: :desc)

            elsif @params[:day] && @params[:start_time]
              @existing_teachers = User.paginate(page: 1, per_page: 10)
                                       .includes(:courses, :roles, :availabilities)
                                       .where({:courses => {:id => @params[:course]}, :roles => {:url_slug => 'volunteer'}, :availabilities => Availability.where('day = ? AND start_time >= ?', @params[:day].split(/,/), @params[:start_time]).exists })
                                       .order(last_sign_in_at: :desc)

            elsif @params[:day] && @params[:end_time]
              @existing_teachers = User.paginate(page: 1, per_page: 10)
                                       .includes(:courses, :roles, :availabilities)
                                       .where({:courses => {:id => @params[:course]}, :roles => {:url_slug => 'volunteer'}, :availabilities => Availability.where('day = ? AND end_time <= ?', @params[:day].split(/,/), @params[:end_time]).exists })
                                       .order(last_sign_in_at: :desc)


            elsif @params[:day]
              @existing_teachers = User.paginate(page: 1, per_page: 10)
                                       .includes(:courses, :roles, :availabilities)
                                       .where({:courses => {:id => @params[:course]}, :roles => {:url_slug => 'volunteer'}, :availabilities => { :day => @params[:day].split(/,/) }} )
                                       .order(last_sign_in_at: :desc)

            elsif @params[:start_time]
              @existing_teachers = User.paginate(page: 1, per_page: 10)
                                       .includes(:courses, :roles, :availabilities)
                                       .where({:courses => {:id => @params[:course]}, :roles => {:url_slug => 'volunteer'}, :availabilities => Availability.where('start_time >= ?', @params[:start_time]).exists })
                                       .order(last_sign_in_at: :desc)

            elsif @params[:end_time]
              @existing_teachers = User.paginate(page: 1, per_page: 10)
                                       .includes(:courses, :roles, :availabilities)
                                       .where({:courses => {:id => @params[:course]}, :roles => {:url_slug => 'volunteer'}, :availabilities => Availability.where('end_time <= ?', @params[:end_time]).exists })
                                       .order(last_sign_in_at: :desc)

            end
          else
            @existing_teachers = User.paginate(page: 1, per_page: 10)
                                     .includes(:courses, :roles, :availabilities)
                                     .where({:courses => {:id => @params[:course]}, :roles => {:url_slug => 'volunteer'} })
                                     .order(last_sign_in_at: :desc)
          end
        end


      end
    end
  end
end
