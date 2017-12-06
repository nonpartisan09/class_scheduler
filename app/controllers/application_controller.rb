class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  respond_to :json, :xml, :html
  before_action :configure_permitted_parameters, if: :devise_controller?

  def index
    if current_user
      user = UserDecorator.new(current_user)
      user = user.simple_decorate
    else
      user = { }
    end
    programs = Program.all

    @data = {
        :currentUser => user,
        :programs => programs
    }

    render :index
  end

  def t_and_c
    render :t_and_c
  end

  protected

  def configure_permitted_parameters
    attributes = [ :thumbnail_image ]
    devise_parameter_sanitizer.permit(:sign_up, keys: attributes)
    devise_parameter_sanitizer.permit(:account_update, keys: attributes)
  end
end
