class SessionsController < Devise::SessionsController
  prepend_before_action :require_no_authentication, :only => [:create ]

  before_action :ensure_params_exist, :only => [:create]
  after_action :check_if_logged_in, :only => [:destroy]
  respond_to :json

  def create
    build_resource
    resource = User.find_for_database_authentication(:email=>params[:user][:email])
    return invalid_login_attempt unless resource

    if resource.valid_password?(params[:user][:password])
      sign_in('user', resource)
      user = UserDecorator.new(current_user).simple_decorate
      @data = { :success => true, :currentUser => user }

      respond_to do |format|
        format.html { redirect_to root_path }
        format.json { render json: @data }
      end
      return
    end
    invalid_login_attempt
  end

  def new
    self.resource = resource_class.new(sign_in_params)

    if self.resource.email.present?
      @message = 'It seems you have entered the wrong credentials.'
    end

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

  protected
  def ensure_params_exist
    return unless params[:user].blank? && params[:user][:password].blank? && params[:user][:email].blank?
    render :json=> { :success=>false, :error => { :message => 'Missing email and password' } }, :status=> 422
  end

  def invalid_login_attempt
    warden.custom_failure!
    render :json=> { :success=>false, :error => { :message => 'Error with your login or password' } }, :status=>401
  end

  def check_if_logged_in
    if current_user.present?
      redirect_to root_path
    end
  end
end
