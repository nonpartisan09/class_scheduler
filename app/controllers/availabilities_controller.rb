class AvailabilitiesController < ApplicationController
  include AvailabilitiesSorter
  include AvailabilityTimesGenerator

  before_action :authenticate_user!
  before_action :check_if_volunteer?, except: [:search]
  before_action :check_if_client?, only: [:search]
  before_action :permitted_params, only: [:create]

  def search
    user = UserDecorator.new(current_user).simple_decorate
    programs = Program.all
    languages = Language.all
    days = I18n.translate 'date.day_names'
    @data = {
        :currentUser => user,
        :languages => languages,
        :programs => programs,
        :days => days,
        :search => {
          language: user[:language_ids],
          program: user[:program_ids],
          day: (0..6).to_a
        },
    }

    render :search
  end

  def new
    user = UserDecorator.new(current_user).simple_decorate
    programs = Program.all
    timezones = ActiveSupport::TimeZone.all.map(&:name)
    days = I18n.translate 'date.day_names'

    availabilityOptions = ValidAvailabilityTimes.new(current_user_timezone)
    
    @data = {
        :availabilities => { },
        :currentUser => user,
        :programs => programs,
        :timezones => timezones,
        :days => days,
        :availability_start_times => availabilityOptions.get_availability_start_time_options,
        :availability_end_times => availabilityOptions.get_availability_end_time_options
    }

    render :new
  end

  def create
    if permitted_params.present?
      message = []
      status = :ok

      Availability.transaction do
        permitted_params.each do |key, value|
          puts ['availability.transaction','key', key, 'value', value];
          creation = Contexts::Availabilities::Creation.new(permit_nested(value), current_user)

          begin
            @availability = creation.execute
          rescue Contexts::Availabilities::Errors::UnknownAvailabilityError,
              Contexts::Availabilities::Errors::OverlappingAvailability,
              Contexts::Availabilities::Errors::DayMissing,
              Contexts::Availabilities::Errors::StartTimeMissing,
              Contexts::Availabilities::Errors::StartTimeWrongFormat,
              Contexts::Availabilities::Errors::EndTimeMissing,
              Contexts::Availabilities::Errors::EndTimeWrongFormat,
              Contexts::Availabilities::Errors::ShortAvailability => e
            message << e.message
            status = :unprocessable_entity
          else
            message << nil # no error message for this availability
          end
        end
        raise ActiveRecord::Rollback, "create availability errors" if status != :ok
      end
      render :json=> { :message => message }, :status => status
    end
  end

  def index
    user = UserDecorator.new(current_user).simple_decorate
    programs = current_user.programs
    availabilities_unsorted = Availability.where(:user => current_user).collect{ |n|
      AvailabilityDecorator.new(n, {
          :timezone => current_user_timezone,
          :user_timezone => current_user_timezone
      }).self_decorate
    }

    availabilities = sort_availabilities(availabilities_unsorted)
    
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
