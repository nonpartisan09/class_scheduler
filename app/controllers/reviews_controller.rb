class ReviewsController < ApplicationController
  before_action :authenticate_user!
  before_action :permitted_params, except: [ :author_index]
  after_action :update_average_rating, except: [ :index, :author_index ]

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
     @comments = get_ten_last_comments
   rescue Exception => e
     message = e.message
     status = :unprocessable_entity

     render json: { message: message }, status: status
   else
     message = I18n.t('custom_success.messages.review_created')
     review = ReviewDecorator.new(@review, {
         reviewee_first_name: @user.first_name,
         reviewer: current_user }).simple_decorate

     render json: {
         message: message,
         review: review,
         comments: @comments
     }, status: :ok
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
      @comments = get_ten_last_comments
    rescue Exception => e
      message = e.message
      status = :unprocessable_entity

      render json: { message: message }, status: status
    else
      message = I18n.t('custom_success.messages.review_updated')
      review = ReviewDecorator.new(@review, {
          reviewee_first_name: @user.first_name,
          reviewer: current_user }).simple_decorate

      render json: {
          message: message,
          review: review,
          comments: @comments
      }, status: :ok
    end
  end

  def index
    redirect_if_unauthorized

    begin
      reviews = Review.received_review_search(permitted_params)
      comments = reviews.collect{ |review| ReviewDecorator.new(review).decorate }
    rescue Exception => e
      message = e.message
      status = :unprocessable_entity

      render json: { message: message }, status: status
    else

      render json: { ten_last_comments: comments }, status: :ok
    end

  end

  def author_index
    redirect_if_unauthorized

    begin
      user = User.find_by_url_slug(params[:url_slug])
      reviews = Review.authored_review_search(params)
      comments = reviews.collect{ |review| ReviewDecorator.new(review).decorate }

      @data = {
          comments: comments,
          reviewer: user.first_name,
          currentUser: UserDecorator.new(current_user).simple_decorate
      }

      render :author_index
    rescue Exception => e
      message = e.message
      status = :unprocessable_entity

      render json: { message: message }, status: status
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

  def get_ten_last_comments
    received_reviews = @user.received_reviews

    if received_reviews.present?
      count = received_reviews.count
      ten_last_comments = Review.received_review_search(permitted_params).collect{ |review| ReviewDecorator.new(review).decorate }

      @comments = {
          count: count,
          ten_last_comments: ten_last_comments
      }
    end
  end

  def update_average_rating
    begin
      ratings = Review.where(:user_id => @user.id)
      rating_count = ratings.count
      average_rating = ratings.average(:review)

      @user.update_attributes(:average_rating => average_rating, :rating_count => rating_count)
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
    params.permit([
        :user_id,
        :review,
        :id,
        :comment,
        :order
    ])
  end
end
