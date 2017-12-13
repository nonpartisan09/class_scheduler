class UserProfilesController < ApplicationController
  before_action :authenticate_user!

  def show
    unless current_user.present?
      redirect_to root_path
    end
    user = UserDecorator.new(current_user)
    current_user = user.decorate
    programs = Program.all
    timezones = ActiveSupport::TimeZone.all.sort

    @data = {
        :programs => programs,
        :currentUser => current_user,
        :timezones => timezones
    }

    render :show
  end
end
