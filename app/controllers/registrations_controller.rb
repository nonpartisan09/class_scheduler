class RegistrationsController < Devise::RegistrationsController
  before_action :sign_up_params, only: [ :create ]
  before_action :account_update_params, :authenticate_user!, only: [ :update ]

  def new
    build_resource({})

    yield resource if block_given?

    courses = Course.all
    @data = { :classes => courses }

    validate_role_params
    respond_with(resource, render: :new)
  end

  def create
    begin
      validate_role_params

      courses = params[:user][:courses]
      build_resource(sign_up_params)

      @registration = Contexts::Users::Creation.new(resource, resource_name, @role_id, courses)

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

      render json: { error: { message: @message } }, status: 409
    end
  end

  def update
    self.resource = resource_class.to_adapter.get!(send(:"current_#{resource_name}").to_key)
    prev_unconfirmed_email = resource.unconfirmed_email if resource.respond_to?(:unconfirmed_email)

    if account_update_params[:password].present?
      resource_updated = update_resource(resource, account_update_params)
    else
      resource_updated = resource.update_attributes(account_update_params.except(:password, :password_confirmation, :current_password))
    end

    yield resource if block_given?
    if resource_updated
      if is_flashing_format?
        flash_key = update_needs_confirmation?(resource, prev_unconfirmed_email) ?
                        :update_needs_confirmation : :updated
        set_flash_message :notice, flash_key
      end
      bypass_sign_in resource, scope: resource_name
      respond_with resource, location: after_update_path_for(resource)
    else
      clean_up_passwords resource
      set_minimum_password_length
      respond_with resource
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

  def sign_up_params
    params.require(:user).permit(
        :first_name,
        :email,
        :password,
        :password_confirmation,
        :description,
        :contact_permission,
        :terms_and_conditions,
        :role,
        :address,
        :city,
        :thumbnail_image,
        :courses => '',
        :role_ids => []
    )
  end

  def account_update_params
    params.require(:user).permit(
        :first_name,
        :email,
        :description,
        :current_password,
        :password,
        :password_confirmation,
        :role,
        :address,
        :city,
        :thumbnail_image,
        :courses => ''
    )
  end

  def resource_name
    :user
  end
end
