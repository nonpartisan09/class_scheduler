require 'active_support/concern'

module HasReviewSearch
  extend ActiveSupport::Concern

  included do
    def self.search(user, order)
          belongs_to_user(user)
          .in_order(order)
    end

    scope :belongs_to_user, proc { |user|
      if user.present?
        user_id = User.find_by_url_slug!(user)
        where(:user_id => user_id)
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
        raise Exception, "Cannot sort by #{order}"
      end
    }
  end

  module ClassMethods

  end
end
