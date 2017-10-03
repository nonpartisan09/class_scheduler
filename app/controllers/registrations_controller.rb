class RegistrationsController < Devise::RegistrationsController
  before_action :configure_permitted_parameters

  def new
    build_resource({})

    yield resource if block_given?

    validate_role_params
    respond_with(resource, render: :new)
  end

  def create
    if !@current_user
      begin
        validate_role_params

        build_resource(sign_up_params)

        @registration = Contexts::Users::Creation.new(resource, resource_name)

        @registration.execute

        if @user.persisted?
          if @user.active_for_authentication?
            sign_up(resource_name, @user)

            respond_with @user, location: after_sign_up_path_for(@user)
          else
            expire_data_after_sign_in!
            respond_with @user, location: after_inactive_sign_up_path_for(@user)
          end
        else
          clean_up_passwords @user
          set_minimum_password_length

          respond_with @user
        end

      rescue Contexts::Users::Errors::AlreadyUsedEmailAlreadyUsedDisplayName,
          Contexts::Users::Errors::AlreadyUsedDisplayName,
          Contexts::Users::Errors::AlreadyUsedEmail => e
        @message = e.message

        render :new
      end
    elsif @current_user
      redirect_to '/'
    end
  end

  private

  def validate_role_params
    @role = Role.where("url_slug = ? AND displayable = ?", params[:role], true)

    if @role.present?
      @role_url_slug = @role.take.url_slug
      @role_id = @role.take.id
    else
      raise Contexts::Users::Errors::UnknownRegistrationError, 'It seems there was a problem with your registration, thanks for contacting us.'
    end
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [
        :display_name,
        :first_name,
        :last_name,
        :email,
        :password,
        :password_confirmation,
        :contact_permission,
        :terms_and_conditions,
        :remember_me,
        :role,
        :role_ids
    ])
  end

  def resource_name
    :user
  end
end
