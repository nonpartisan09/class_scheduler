class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  respond_to :json, :xml, :html

  def index
    if current_user
      user = UserDecorator.new(current_user)
      user = user.simple_decorate
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

  private
  def authenticate_user!
    if user_signed_in?
      super
    else
      redirect_to sign_in_path
    end
  end
end
