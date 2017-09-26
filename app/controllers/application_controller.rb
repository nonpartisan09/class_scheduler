class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def index
    @current_user = current_user
    render :index
  end
end
