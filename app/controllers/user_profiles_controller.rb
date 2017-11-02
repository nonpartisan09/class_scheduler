class UserProfilesController < ApplicationController
  before_action :authenticate_user!

  def show
    unless current_user.present?
      redirect_to root_path
    end
    user = UserDecorator.new(current_user)
    user = user.decorate
    courses = Course.all

    @data = {
        :courses => courses,
        :currentUser => user
    }

    render :show
  end
end
