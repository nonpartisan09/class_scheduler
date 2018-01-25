class ResultsController < ApplicationController
  before_action :authenticate_user!
  before_action :permit_search_params

  def index
    begin
      search = Contexts::Availabilities::Search.new(permit_search_params, current_user)
      results = search.execute
    rescue Contexts::Availabilities::Errors::ProgramMissing,
        Contexts::Availabilities::Errors::DayMissing,
        Contexts::Availabilities::Errors::IncorrectOrder => e
      @message = e.message
      render json: { error: { message: @message } }, status: :unprocessable_entity
    end

    if results.present?
      volunteers = results.collect { |volunteer| UserDecorator.new(volunteer) }
      volunteers = volunteers.collect { |volunteer| volunteer.simple_decorate }
      page_count = (results.total_entries/6.to_f).ceil

      render json: { volunteers: volunteers, page_count: page_count, current_page: results.current_page }, status: :ok
    else
      head :no_content
    end
  end

  def show
    user = UserDecorator.new(current_user).simple_decorate

    @data = { :currentUser => user }

    render :show
  end

  def permit_search_params
    params.permit(
        :day,
        :start_time,
        :end_time,
        :program,
        :distance,
        :order,
        :page
    )
  end
end
