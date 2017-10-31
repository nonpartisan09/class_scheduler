module Contexts
  module Availabilities
    class Search

      def initialize(search_params)
        @params = search_params
      end

      def execute
        if @params[:course]
          @course = Course.find(@params[:course])

          @existing_teachers = @course.users.teacher

          if @existing_teachers.present?
            if @params[:day].present? || @params[:start_time].present? || @params[:end_time].present?
              @existing_teachers = @existing_teachers.pluck(:id)
              @existing_teachers = User.where(:id => @existing_teachers)

              if @params[:day] && @params[:start_time] && @params[:end_time]

                @existing_teachers = @existing_teachers.includes(:availabilities).where(Availability.where('day = ? AND start_time >= ? AND end_time <= ?', @params[:day].split(/,/), @params[:start_time], @params[:end_time]).exists )
              elsif @params[:start_time] && @params[:end_time]
                @existing_teachers = @existing_teachers.includes(:availabilities).where(Availability.where('start_time >= ? AND end_time <= ?', @params[:start_time], @params[:end_time]).exists )

              elsif @params[:day] && @params[:start_time]
                @existing_teachers = @existing_teachers.includes(:availabilities).where(Availability.where('day = ? AND start_time >= ?', @params[:day].split(/,/), @params[:start_time]).exists )

              elsif @params[:day] && @params[:end_time]
                @existing_teachers = @existing_teachers.includes(:availabilities).where(Availability.where('day = ? AND end_time <= ?', @params[:day].split(/,/), @params[:end_time]).exists )

              elsif @params[:day]
                @existing_teachers = @existing_teachers.where(Availability.where(day: @params[:day].split(/,/)).exists )

              elsif @params[:start_time]
                @existing_teachers = @existing_teachers.where(Availability.where('start_time >= ?', @params[:start_time]).exists )

              elsif @params[:end_time]
                @existing_teachers = @existing_teachers.where(Availability.where('end_time <= ?', @params[:end_time]).exists )
              end
            end
          end
        end
        @existing_teachers
      end
    end
  end
end
