class UserProfilesController < ApplicationController
  before_action :authenticate_user!

  def show
    unless current_user.present?
      redirect_to "/404"
    end

    @user_profile = UserProfile.new(current_user)

    respond_with @user_profile
  end

  private

  def permitted_params
    params.permit(
        :display_name,
        :email
    )
  end
end
