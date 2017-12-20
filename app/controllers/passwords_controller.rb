class PasswordsController < Devise::PasswordsController
  before_action :resource_params, only: [ :update, :create   ]

  def new
    super
  end

  def create
    super
  end

  def edit
    super
  end

  def update
    super
  end

  def resource_name
    :user
  end

  private

  def resource_params
    params.permit(:email, :password, :reset_password_token, :user)
  end
end
