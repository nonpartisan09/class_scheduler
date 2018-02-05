class AvailabilitiesController < ApplicationController
  before_action :authenticate_user!
  before_action :check_if_volunteer?, except: [:search]
  before_action :check_if_client?, only: [:search ]
  before_action :permitted_params, only:

  def search
    user = UserDecorator.new(current_user).simple_decorate
    programs = Program.all
    days = I18n.translate 'date.day_names'

    @data = {
        :currentUser => user,
        :programs => programs,
        :days => days
    }

    render :search
  end

  def new
    user = UserDecorator.new(current_user).simple_decorate
    programs = Program.all
    timezones = ActiveSupport::TimeZone.all
    days = I18n.translate 'date.day_names'

    @data = {
        :availabilities => { },
        :currentUser => user,
        :programs => programs,
        :timezones => timezones,
        :days => days
    }

    render :new
  end

  def create
    if permitted_params.present?
      message = []
      status = []

      permitted_params.each do |number|
        creation = Contexts::Availabilities::Creation.new(permit_nested(permitted_params[number]), current_user)

        begin
          @availability = creation.execute
        rescue Contexts::Availabilities::Errors::UnknownAvailabilityError,
            Contexts::Availabilities::Errors::OverlappingAvailability,
            Contexts::Availabilities::Errors::StartTimeMissing,
            Contexts::Availabilities::Errors::EndTimeMissing,
            Contexts::Availabilities::Errors::ShortAvailability => e
          message[number.to_i] = e.message
          status = :unprocessable_entity
        else
          status = :ok
          message << { availability: `#{@availability.id} successfully created` }
        end
      end

      render :json => { :message => message }, :status => status
    end
  end

  def index
    user = UserDecorator.new(current_user).simple_decorate
    programs = current_user.programs
    availabilities = Availability.where(:user => current_user).collect{ |n| AvailabilityDecorator.new(n, current_user_timezone).decorate }

    @data = {
        :currentUser => user,
        :programs => programs,
        :availabilities => availabilities
    }

    respond_with(@data, :index)
  end

  def destroy
    @availability = Availability.find(params[:id])
    @availability.destroy
  end

  private

  def current_user_timezone
    return current_user[:timezone] if current_user[:timezone].present?
    ''
  end

  def check_if_volunteer?
    unless current_user.volunteer?
      redirect_to root_path
    end
  end

  def check_if_client?
    unless current_user.client?
      redirect_to root_path
    end
  end

  def permitted_params
    params.require(:availabilities)
  end

  def permit_nested(params)
    params.permit(
        :day,
        :start_time,
        :end_time
    )
  end
end
