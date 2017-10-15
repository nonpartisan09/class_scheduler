class UserProfilesController < ApplicationController
  before_action :authenticate_user!

  def show
    unless current_user.present?
      redirect_to root_path
    end
    user = UserProfile.new(current_user)
    user = user.decorate

    @data = { :currentUser => user }

    render :show
  end

  private

  def permitted_params
    params.permit(
        :display_name,
        :email
    )
  end
end
