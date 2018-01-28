class UserProfilesController < ApplicationController
  before_action :authenticate_user!

  def show
    unless current_user
      redirect_to root_path && return
    end
    user = UserDecorator.new(current_user)
    current_user = user.updateable
    programs = Program.all
    languages = Language.all
    timezones = ActiveSupport::TimeZone.all

    @data = {
        :programs => programs,
        :currentUser => current_user,
        :timezones => timezones,
        :languages => languages
    }

    render :show
  end
end
