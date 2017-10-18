class AvailabilitiesController < ApplicationController
  before_action :authenticate_user!, except: [ :results ]
  before_action :check_if_volunteer?, except: [:search, :results]
  before_action :check_if_student?, only: [:search ]

  def results
    if params[:course]
      @course = Course.find(params[:course])

      @existing_teachers = @course.users

      if @existing_teachers.present?
        if params[:day].present? || params[:start_time].present? || params[:end_time].present?
          @existing_teachers = @existing_teachers.pluck(:id)
          @existing_teachers = User.where(:id => @existing_teachers)

          if params[:day] && params[:start_time] && params[:end_time]

            @existing_teachers = @existing_teachers.includes(:availabilities).where(Availability.where('day = ? AND start_time >= ? AND end_time <= ?', params[:day], params[:start_time], params[:end_time]).exists )

          elsif params[:start_time] && params[:end_time]
            @existing_teachers = @existing_teachers.includes(:availabilities).where(Availability.where('start_time >= ? AND end_time <= ?', params[:start_time], params[:end_time]).exists )

          elsif params[:day] && params[:start_time]
            @existing_teachers = @existing_teachers.includes(:availabilities).where(Availability.where('day = ? AND start_time >= ?', params[:day], params[:start_time]).exists )

          elsif params[:day] && params[:end_time]
            @existing_teachers = @existing_teachers.includes(:availabilities).where(Availability.where('day = ? AND end_time <= ?', params[:day], params[:end_time]).exists )

          elsif params[:day]
            ap @existing_teachers
            @existing_teachers = @existing_teachers.where(Availability.where('day = ?', params[:day]).exists )

          elsif params[:start_time]
            @existing_teachers = @existing_teachers.where(Availability.where('start_time >= ?', params[:start_time]).exists )

          elsif params[:end_time]
            @existing_teachers = @existing_teachers.where(Availability.where('end_time <= ?', params[:end_time]).exists )
          end
        end

        render json: { teachers: @existing_teachers }, status: :ok
      else
        head :no_content
      end
    end
  end

  def search
    user = UserDecorator.new(current_user)
    courses = Course.all
    timezones = ActiveSupport::TimeZone.all.sort
    days =  Date::DAYNAMES

    @data = {
        :currentUser => user.decorate,
        :courses => courses,
        :timezones => timezones,
        :days => days
    }

    render :search
  end

  def new
    user = UserDecorator.new(current_user)
    courses = Course.all
    timezones = ActiveSupport::TimeZone.all.sort
    days =  Date::DAYNAMES

    @data = {
        :availabilities => { },
        :currentUser => user.decorate,
        :courses => courses,
        :timezones => timezones,
        :days => days
    }

    render :new
  end

  def create
    if permitted_params.present?
      message = []
      status = []
      permitted_params.each do |n|
        creation = Contexts::Availabilities::Creation.new(permitted_nested(n), current_user)

        begin
          @availability = creation.execute
        rescue Contexts::Availabilities::Errors::UnknownAvailabilityError,
            Contexts::Availabilities::Errors::OverlappingAvailability,
            Contexts::Availabilities::Errors::ShortAvailability => e
          message << e.message
          status << :unprocessable_entity
        else
          message << 'all good'
        end
      end
      render :json=> { :message=> message }, :status => :ok
    end
  end

  def index
    user = UserDecorator.new(current_user).decorate
    courses = current_user.courses
    availabilities = Availability.where(:user => current_user)

    @data = {
        :currentUser => user,
        :courses => courses,
        :availabilities => availabilities
    }

    respond_with(@data, :index)
  end

  def destroy
    @availability = Availability.find(params[:id])
    @availability.destroy

    redirect_to availabilities_path
  end

  private

  def check_if_volunteer?
    unless current_user.volunteer?
      redirect_to root_path
    end
  end

  def check_if_student?
    unless current_user.student?
      redirect_to root_path
    end
  end

  def build_search
    { :start_time => '', :end_time => '', :day => '' }
  end

  def permitted_params
    params.require(:availabilities)
  end

  def permitted_nested(n)
    n.permit(
        :day,
        :start_time,
        :end_time,
        :timezone
    )
  end
end
