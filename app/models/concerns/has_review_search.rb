require 'active_support/concern'

module HasReviewSearch
  extend ActiveSupport::Concern

  included do
    def self.search(params)
          belongs_to_user(params)
          .in_order(params[:order])
    end

    scope :belongs_to_user, proc { |params|
      if params[:user_id].present?
        user = User.find_by_url_slug!(params[:user_id])
        user.received_reviews
      end
    }

    scope :in_order, proc { | order |
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
