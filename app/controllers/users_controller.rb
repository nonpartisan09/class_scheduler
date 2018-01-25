class UsersController < ApplicationController
  before_action :authenticate_user!, :permitted_params

  def show
    unless current_user
      redirect_to root_path && return
    end
    user = User.find_by_url_slug(permitted_params[:url_slug])

    unless user.present?
      redirect_to root_path && return
    end

    review = Review.where(:author_id => current_user.id, :user_id => user.id).first

    review = ReviewDecorator.new(review).decorate

    @data = {
        :currentUser => UserDecorator.new(current_user).simple_decorate,
        :user => UserDecorator.new(user).decorate,
        :review => review
    }

    render :show
  end

  private

  def permitted_params
    params.permit(:url_slug)
  end
end

