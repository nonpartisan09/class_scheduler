class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  respond_to :json, :xml, :html

  def index
    @current_user = current_user
    @student_role = Role.find_by_url_slug('student').url_slug
    @volunteer_role = Role.find_by_url_slug('volunteer').url_slug
    render :index
  end

  def t_and_c
    render :t_and_c
  end

  def not_found
    render :not_found
  end
end
