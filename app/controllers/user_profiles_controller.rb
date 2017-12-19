class UserProfilesController < ApplicationController
  before_action :authenticate_user!

  def show
    unless current_user.present?
      redirect_to root_path
    end

    user = UserDecorator.new(current_user).decorate
    programs = Program.all
    timezones = ActiveSupport::TimeZone.all

    @data = {
        :programs => programs,
        :currentUser => user,
        :timezones => timezones
    }

    render :show
  end
end
