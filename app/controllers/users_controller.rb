class UsersController < ApplicationController
  before_action :authenticate_user!, :permitted_params

  def show
    unless current_user
      redirect_to root_path && return
    end
    @user = User.find_by_url_slug(permitted_params[:url_slug])

    unless @user.present?
      redirect_to root_path && return
    end

    review = Review.where(:author_id => current_user.id, :user_id => @user.id).first

    review = ReviewDecorator.new(review, {
        reviewee_first_name: @user.first_name,
        reviewer: current_user
    }).simple_decorate

    @comments = get_ten_last_comments

    availabilities = Availability.where(:user => @user.id).collect{ |n|
      AvailabilityDecorator.new(n, {
          :timezone => current_user.timezone,
          :user_timezone => @user.timezone
      }).decorate
    }

    @data = {
        :currentUser => UserDecorator.new(current_user).simple_decorate,
        :user => UserDecorator.new(@user).decorate,
        :comments => @comments,
        :review => review,
        :availabilities => availabilities
    }

    render :show
  end

  private

  def get_ten_last_comments
    received_reviews = @user.received_reviews

    if received_reviews.present?
      count = received_reviews.count
      ten_last_comments = Review.received_review_search(permitted_params).collect do |review|
        ReviewDecorator.new(review,
            { reviewee_first_name: @user.first_name }
        ).decorate
      end

      @comments = {
          count: count,
          ten_last_comments: ten_last_comments
      }
    end
  end

  def permitted_params
    params.permit(:url_slug)
  end
end

