class ReviewsController < ApplicationController
  before_action :authenticate_user!
  before_action :permitted_params

  def create
    if permitted_params[:user_id].nil? && permitted_params[:review].nil? && current_user.nil?
      redirect_to root_path and return
    end

   begin
     user = User.find_by_url_slug!(permitted_params[:user_id])

     review = Review.where(:author_id =>  current_user.id, :user_id => user.id).first

     if review.present?
       review.update_attributes(:review => permitted_params[:review].to_i)

     else
       review = Review.create!(
           user_id: user.id.to_i,
           author_id: current_user.id.to_i,
           review: permitted_params[:review].to_i
       )
     end

   rescue Exception => e
     message = e.message
     status = :unprocessable_entity

     render json: { message: message }, status: status
   else
     render json: { review: review }, status: :ok
   end
  end

  def show
    user = UserDecorator.new(current_user).simple_decorate

    @data = { :currentUser => user }

    render :show
  end

  def permitted_params
    params.permit(
        :user_id,
        :review
    )
  end
end
