class AvailabilitiesController < ApplicationController
  before_action :authenticate_user!, except: [ :results ]
  before_action :check_if_volunteer?, except: [:search, :results]
  before_action :check_if_student?, only: [:search ]

  def results
    if params[:course]
      @course = Course.find(params[:course])

      @existing_teachers = @course.users

      if params[:day].present? || params[:start_time].present? || params[:end_time].present?
        @existing_teachers = @existing_teachers.pluck(:id)
        @existing_teachers = User.where('id  = ?', @existing_teachers)

        if params[:day] && params[:start_time] && params[:end_time]
          @existing_teachers = @existing_teachers.includes(:availabilities).where(Availability.where('day = ? AND start_time >= ? AND end_time <= ?', params[:day], params[:start_time], params[:end_time]).exists )

        elsif params[:start_time] && params[:end_time]
          @existing_teachers = @existing_teachers.includes(:availabilities).where(Availability.where('start_time >= ? AND end_time <= ?', params[:start_time], params[:end_time]).exists )
        elsif params[:day] && params[:start_time]
          @existing_teachers = @existing_teachers.includes(:availabilities).where(Availability.where('day = ? AND start_time >= ?', params[:day], params[:start_time]).exists )

        elsif params[:day] && params[:end_time]
          @existing_teachers = @existing_teachers.includes(:availabilities).where(Availability.where('day = ? AND end_time <= ?', params[:day], params[:end_time]).exists )

        elsif params[:day]
          @existing_teachers = @existing_teachers.where(Availability.where(:day => params[:day]).exists )

        elsif params[:start_time]
          @existing_teachers = @existing_teachers.where(Availability.where('start_time >= ?', params[:start_time]).exists )

        elsif params[:end_time]
          @existing_teachers = @existing_teachers.where(Availability.where('end_time <= ?', params[:end_time]).exists )
        end
      end

      render json: { teachers: @existing_teachers }
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
    availability = Availability.new
    user = UserDecorator.new(current_user)
    courses = Course.all
    timezones = ActiveSupport::TimeZone.all.sort
    days =  Date::DAYNAMES

    @data = {
        :availabilities => { },
        :availability => availability,
        :currentUser => user.decorate,
        :courses => courses,
        :timezones => timezones,
        :days => days
    }

    render :new
  end

  def create
    creation = Contexts::Availabilities::Creation.new(permitted_params, current_user)

    begin
      @availability = creation.execute
    rescue Contexts::Availabilities::Errors::UnknownAvailabilityError,
        Contexts::Availabilities::Errors::OverlappingAvailability,
        Contexts::Availabilities::Errors::ShortAvailability => e
      render :json=> { :message=> e.message }, :status=> 422
    else

      redirect_to availabilities_path
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
    params.require(:availability).permit(
          :day,
          :start_time,
          :end_time,
          :timezone
      )
    end
end
