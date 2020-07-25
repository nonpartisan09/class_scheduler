# frozen_string_literal: true

class UsersController < ApplicationController
  include AvailabilitiesSorter
  
  before_action :authenticate_user!, except: :cities
  before_action :permitted_params, except: :cities

  def show
    redirect_to root_path && return unless current_user
    @user = User.find_by_url_slug(permitted_params[:url_slug])

    redirect_to root_path && return unless @user.present?

    review = Review.where(author_id: current_user.id, user_id: @user.id).first

    review = ReviewDecorator.new(review,
                                 reviewee_first_name: @user.first_name,
                                 reviewer: current_user).simple_decorate

    @comments = get_ten_last_comments

    @availabilities = Availability.where(user: @user.id)

    normalize_for_current_user

    @data = {
      currentUser: UserDecorator.new(current_user).simple_decorate,
      user: UserDecorator.new(@user).decorate,
      comments: @comments,
      review: review,
      availabilities: @availabilities
    }

    render :show
  end

  def cities
    cities = User.cities
    render json: { cities: cities }, status: :ok
  end

  private

  def normalize_for_current_user
    # TODO: please improve
    availabilities = []
    @availabilities.each do |availability|
      Time.zone = current_user.timezone
      first_day = availability.start_time.strftime('%A')
      second_day = availability.end_time.strftime('%A')

      if first_day != second_day
        split_availability = AvailabilityDecorator.new(availability,
                                                       timezone: current_user.timezone,
                                                       user_timezone: @user.timezone,
                                                       day: first_day,
                                                       end_time: '23:59 ' + Time.zone.now.zone).decorate

        if start_and_end_times_differ(split_availability)  
          availabilities << split_availability
        end

        split_availability_2 = AvailabilityDecorator.new(availability,
                                                         timezone: current_user.timezone,
                                                         user_timezone: @user.timezone,
                                                         day: second_day,
                                                         start_time: '00:00 '  + Time.zone.now.zone).decorate

        if start_and_end_times_differ(split_availability_2)  
          availabilities << split_availability_2
        end

      else
        availability = AvailabilityDecorator.new(availability,
                                                 timezone: current_user.timezone,
                                                 user_timezone: @user.timezone).decorate

        availabilities << availability
      end
    end
    @availabilities = sort_availabilities(availabilities)
  end

  def get_ten_last_comments
    received_reviews = @user.received_reviews
    count = received_reviews.count
    ten_last_comments = Review.received_review_search(permitted_params).collect do |review|
      ReviewDecorator.new(review,
                          reviewee_first_name: @user.first_name).decorate
    end

    @comments = {
      count: count,
      ten_last_comments: ten_last_comments
    }
  end

  def permitted_params
    params.permit(:url_slug)
  end

  def start_and_end_times_differ(availability) 
    availability[:start_time] != availability[:end_time]
  end
end
