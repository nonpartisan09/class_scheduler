class RegistrationsController < Devise::RegistrationsController
  before_action :configure_permitted_parameters

  def new
    build_resource({})

    yield resource if block_given?

    validate_role_params
    @role = role_id

    respond_with(resource, render: :new)
  end

  def create
    if !@current_user
      begin
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

      rescue Contexts::Users::Errors::AlreadyUsedEmail,
          Contexts::Users::Errors::MustAgreeToTermsAndConditions,
          Contexts::Users::Errors::AlreadyUsedDisplayName,
          Contexts::Users::Errors::MultipleErrors, Contexts::Users::Errors::UnknownRegistrationError => e
        @message = e.message
        render :new
      end
    elsif @current_user
      redirect_to '/'
    end
  end

  def role_id
    role = Role.where("url_slug = ? AND displayable = ?", params[:role], true)

    unless role.empty?
      role.take.id
    end
  end

  private

  def validate_role_params
    unless role_id.present?
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
