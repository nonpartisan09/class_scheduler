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
    if current_user
      user = UserDecorator.new(current_user)
      user = user.simple_decorate
    else
      user = { }
    end

    @data = {
        :currentUser => user,
    }

    render :t_and_c
  end

  protected

  def authenticate_admin_user!
    unless user_signed_in? || request.referer != new_user_session_path
      user = User.find_by_email!(params[:user][:email])

      if user.admin?
        authenticate_user!
      else
        redirect_to root_path and return
      end
    end
  end

  def access_denied(exception)
    redirect_to root_path, alert: exception.message
  end

  def after_sign_in_path_for(resource)
    if resource.admin? && request.referer != new_user_session_path
      super
    else
      admin_dashboard_path
    end
  end

  def configure_permitted_parameters
    attributes = [ :thumbnail_image ]
    devise_parameter_sanitizer.permit(:sign_up, keys: attributes)
    devise_parameter_sanitizer.permit(:account_update, keys: attributes)
  end

end
