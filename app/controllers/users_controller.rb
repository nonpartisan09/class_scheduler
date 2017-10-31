class UsersController < ApplicationController
  def show
    unless current_user
       redirect_to sign_in_path
    end
  end

  private

  def permitted_params
    params.permit(
      :display_name,
      :email,
      :password,
      :terms_and_conditions
    )
  end
end

