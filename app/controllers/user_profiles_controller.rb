class UserProfilesController < ApplicationController
  include TimeZoneMap
  
  before_action :authenticate_user!

  def show
    unless current_user
      redirect_to root_path && return
    end
    user = UserDecorator.new(current_user).updateable
    programs = Program.all
    #url_slug refers to the language in English
    languages = Language.order('url_slug')
    timezones = ActiveSupport::TimeZone.all.map(&:name)
    timezone_map = get_timezone_mapping

    @data = {
        :programs => programs,
        :currentUser => user,
        :timezones => timezones,
        :timezone_map => timezone_map,
        :languages => languages
    }

    render :show
  end
end
