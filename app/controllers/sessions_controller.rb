class SessionsController < Devise::SessionsController
  prepend_before_action :require_no_authentication, :only => [:create ]

  before_action :ensure_params_exist, :only => [:create]
  before_action :check_if_logged_in, :only => [:new]
  after_action :check_if_logged_in, :only => [:destroy]

  respond_to :json

  caches_action :new

  def create
    build_resource
    resource = User.find_for_database_authentication(:email=>params[:user][:email])
    return invalid_login_attempt unless resource

    if resource.valid_password?(params[:user][:password]) && resource.active?
      sign_in('user', resource)
      user = UserDecorator.new(current_user).simple_decorate
      @data = { :success => true, :currentUser => user }

      render json: @data
    elsif resource.valid_password?(params[:user][:password]) && !resource.active?
      account_block_login_attempt
    else
      invalid_login_attempt
    end
  end

  def new
    self.resource = build_resource

    # if self.resource.email.present?
    #   @message = 'It seems you have entered the wrong credentials.'
    # end

    clean_up_passwords(resource)
    yield resource if block_given?
    respond_with(resource, serialize_options(resource))
  end

  def destroy
    super
  end

  def after_sign_in_path_for_user
    root_path
  end

  def resource_name
    :user
  end

  def build_resource(hash=nil)
    self.resource = resource_class.new_with_session(hash || {}, session)
  end

  private

  def ensure_params_exist
    return unless params[:user].blank? && params[:user][:password].blank? && params[:user][:email].blank?
    message = I18n.translate "custom_errors.messages.missing_credentials"
    render :json=> { success: false, error: { message: message  } }, :status=> :unauthorized
  end

  def invalid_login_attempt
    warden.custom_failure!
    message = I18n.translate "custom_errors.messages.incorrect_credentials"
    render :json=> { success: false, error: { message: message } }, status: :unauthorized
  end

  def account_block_login_attempt
    warden.custom_failure!
    message = I18n.translate "custom_errors.messages.deactivated_account"
    render :json=> { success: false, error: { message: message } }, status: :unauthorized
  end

  def check_if_logged_in
    redirect_to root_path(:locale => current_user[:locale]) and return if current_user.present?
  end

  def sign_in_params
    params.require(:user).permit(
        :email,
        :password,
    )
  end
end
