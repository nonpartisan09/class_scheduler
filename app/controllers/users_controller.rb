class UsersController < ApplicationController
  include Devise::Controllers::SignInOut

  def sign_back_in(user)
    sign_in(user, bypass: true)
  end

  private

  def permitted_params
    params.permit(
      :display_name,
      :email,
      :password,
      :contact_permission,
      :terms_and_conditions,
    )
  end
end

