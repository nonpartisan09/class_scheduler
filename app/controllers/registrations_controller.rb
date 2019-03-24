class RegistrationsController < Devise::RegistrationsController
  before_action :sign_up_params, only: [ :create ]
  before_action :account_update_params, :authenticate_user!, only: [ :update ]

  def new
    build_resource({})

    yield resource if block_given?

    programs = Program.all
    languages = Language.all
    timezones = ActiveSupport::TimeZone.all
    @data = { :programs => programs, :timezones => timezones, :languages => languages}

    validate_role_params
    respond_with(resource, render: :new)
  end

  def create
    begin
      validate_role_params

      programs = params[:user][:programs]
      languages = params[:user][:languages]

      build_resource(sign_up_params)

      @registration = Contexts::Users::Creation.new(resource, resource_name, @role_id, programs, languages)

      @registration.execute
      user = UserDecorator.new(@user).simple_decorate
      days = I18n.translate 'date.day_names'

      if @user.persisted?
        if @user.active_for_authentication?
          sign_up(resource_name, @user)

          render json: { currentUser: user, days: days }, status: :ok
        else
          expire_data_after_sign_in!
          render json: { currentUser: user, days: days }, status: :ok
        end
      else
        clean_up_passwords @user
        set_minimum_password_length

        render json: { currentUser: user, days: days }, status: :ok
      end

    rescue Contexts::Users::Errors::AlreadyUsedEmailAlreadyUsedDisplayName,
        Contexts::Users::Errors::AlreadyUsedDisplayName,
        Contexts::Users::Errors::AlreadyUsedEmail => e
      @message = e.message

      render json: { error: { message: @message } }, status: :conflict
    end
  end

  def update
    self.resource = resource_class.to_adapter.get!(send(:"current_#{resource_name}").to_key)
    prev_unconfirmed_email = resource.unconfirmed_email if resource.respond_to?(:unconfirmed_email)

    proxy_update_resource = Proc.new { |resource, params| update_resource(resource, params) }
    resource_updated = User.update(account_update_params, resource, proxy_update_resource)

    yield resource if block_given?
    if resource_updated
      UserMailer.password_updated(resource).deliver_later unless account_update_params[:current_password].nil?

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
      message = I18n.translate custom_errors.messages.unknown_error
      raise Contexts::Users::Errors::UnknownRegistrationError, message
    end
  end

  def sign_up_params
    params.require(:user).permit(
        :address,
        :city,
        :contact_permission,
        :country,
        :description,
        :email,
        :first_name,
        :id,
        :locale,
        :password,
        :password_confirmation,
        :phone_number,
        :role,
        :state,
        :terms_and_conditions,
        :thumbnail_image,
        :timezone,
        :programs => '',
        :languages => '',
        :role_ids => []
    )
  end

  def account_update_params
    params.require(:user).permit(
        :address,
        :city,
        :country,
        :current_password,
        :description,
        :email,
        :email_notification,
        :first_name,
        :id,
        :locale,
        :password,
        :password_confirmation,
        :phone_number,
        :role,
        :state,
        :thumbnail_image,
        :timezone,
        :languages => [],
        :programs => []
    )
  end

  def resource_name
    :user
  end
end
