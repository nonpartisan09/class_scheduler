require 'active_support/concern'

module HasReceivedReviewSearch
  extend ActiveSupport::Concern

  included do
    def self.received_review_search(params)
          received_by_user(params)
          .in_received_order(params[:order])
    end

    scope :received_by_user, proc { |params|
      if params[:user_id].present?
        user = User.find_by_url_slug!(params[:user_id])
        user.received_reviews
      elsif params[:url_slug].present?
        user = User.find_by_url_slug!(params[:url_slug])
        user.received_reviews
      end
    }

    scope :in_received_order, proc { | order |
      case order
        when 'last'
          order(created_at: :desc).limit(10)
        when 'first'
          order(created_at: :asc).limit(10)
        when 'highest'
          order(review: :desc).limit(10)
        when 'lowest'
          order(review: :asc).limit(10)
        else
          order(created_at: :desc).limit(10)
      end
    }
  end

  module ClassMethods

  end
end
