class ReviewsController < ApplicationController
  before_action :authenticate_user!
  before_action :permitted_params
  after_action :update_average_rating, except: [:show]

  def create
    check_if_redirect

   begin
     @user = User.find_by_url_slug!(permitted_params[:user_id])

     @review = Review.new(
         user_id: @user.id.to_i,
         author_id: current_user.id.to_i,
         review: permitted_params[:review].to_i
     )

     @review.save!
   rescue Exception => e
     message = e.message
     status = :unprocessable_entity

     render json: { message: message }, status: status
   else
     render json: { review: ReviewDecorator.new(@review).decorate }, status: :ok
    end
  end

  def update
    check_if_redirect

    begin
      @user = User.find_by_url_slug!(permitted_params[:user_id])

      @review = Review.find(permitted_params[:id])

      @review.review = permitted_params[:review].to_i

      @review.save!
    rescue Exception => e
      message = e.message
      status = :unprocessable_entity

      render json: { message: message }, status: status
    else
      render json: { review: ReviewDecorator.new(@review).decorate }, status: :ok
    end
  end

  def show
    user = UserDecorator.new(current_user).simple_decorate

    @data = { :currentUser => user }

    render :show
  end

  private

  def update_average_rating
    begin
      @average_rating = Review.where(:user_id => @user.id).average(:review)
      @user.average_rating = @average_rating

      @user.save!
    rescue Exception => e
      message = e.message
      status = :unprocessable_entity

      render json: { message: message }, status: status
    end
  end

  def check_if_redirect
    if permitted_params[:user_id].nil? && permitted_params[:review].nil? && current_user.nil?
      redirect_to root_path and return
    end
  end

  def permitted_params
    params.permit(
        :user_id,
        :review,
        :id
    )
  end
end
