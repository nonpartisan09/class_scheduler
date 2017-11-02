class UsersController < ApplicationController
  before_action :authenticate_user!, :permitted_params

  def show
    user = User.find_by_url_slug(params[:url_slug])

    @data = {
        :current_user => UserDecorator.new(current_user).simple_decorate,
        :user => UserDecorator.new(user).decorate
    }

    render :show
  end

  private

  def permitted_params
    params.permit(:url_slug)
  end
end

