class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  respond_to :json, :xml, :html

  def index
    if current_user
      user = UserDecorator.decorate(current_user)
    else
      user = { }
    end
    courses = Course.all

    @data = {
        :currentUser => user,
        :courses => courses
    }

    render :index
  end

  def t_and_c
    render :t_and_c
  end

  def not_found
    render :not_found
  end
end
