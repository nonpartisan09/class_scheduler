require 'active_support/concern'

module HasAuthoredReviewSearch
  extend ActiveSupport::Concern

  included do
    def self.authored_review_search(params)
      authored_by_user(params)
          .in_authored_order(params[:order])
    end

    scope :authored_by_user, proc { |params|
      if params[:user_id].present?
        user = User.find_by_url_slug!(params[:user_id])
        user.authored_reviews
      elsif params[:url_slug].present?
        user = User.find_by_url_slug!(params[:url_slug])
        user.authored_reviews
      end
    }

    scope :in_authored_order, proc { | order |
      case order
      when 'last'
        last(10)
      when 'first'
        first(10)
      when 'highest'
        order(review: :desc)
      when 'lowest'
        order(review: :asc)
      else
        last(10)
      end
    }
  end

  module ClassMethods

  end
end
