class ReviewsController < ApplicationController
  before_action :authenticate_user!
  before_action :permitted_params
  after_action :update_average_rating, except: [:index]

  def create
    check_if_redirect

   begin
     @user = User.find_by_url_slug!(permitted_params[:user_id])

     @user_id = @user.id.to_i
     @current_user_id = current_user.id.to_i

     @review = Review.new(
         user_id: @user_id,
         author_id: @current_user_id,
         review: permitted_params[:review].to_i,
         comment: permitted_params[:comment]
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
      @review.comment = permitted_params[:comment]

      @review.save!
    rescue Exception => e
      message = e.message
      status = :unprocessable_entity

      render json: { message: message }, status: status
    else
      render json: { review: ReviewDecorator.new(@review).decorate }, status: :ok
    end
  end

  def index
    redirect_if_unauthorized

    begin
      reviews = Review.search(permitted_params[:user_id], permitted_params[:order])
      comments = reviews.collect{ |review| ReviewDecorator.new(review).simple_decorate }
    rescue Exception => e
      message = e.message
      status = :unprocessable_entity

      render json: { message: message }, status: status
    else
      render json: { comments: comments }, status: :ok
    end

  end

  def destroy
    redirect_if_unauthorized

    begin
      review = Review.find(permitted_params[:id])

      review.destroy!
    rescue Exception => e
      message = e.message
      status = :unprocessable_entity

      render json: { message: message }, status: status
    end

  end

  private

  def update_average_rating
    begin
      ratings = Review.where(:user_id => @user.id)
      rating_count = ratings.count
      average_rating = ratings.average(:review)

      @user.average_rating = average_rating
      @user.rating_count = rating_count

      @user.save!
    rescue Exception => e
      message = e.message
      status = :unprocessable_entity

      render json: { message: message }, status: status
    end
  end

  def redirect_if_unauthorized
    unless current_user.present?
      redirect_to root_path and return
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
        :id,
        :comment,
        :order
    )
  end
end
