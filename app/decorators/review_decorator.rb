class ReviewDecorator
  include ActionView::Helpers::DateHelper

  attr_reader :review

  def initialize(review)
    @review = review
  end

  def decorate
    {
        :review => review,
        :id => id,
        :comment => comment
    }
  end

  def comment_decorate
    {
        :comment => comment,
        :created_at => created_at,
        :reviewer => reviewer
    }
  end

  def comment
    @review && @review[:comment] || ''
  end

  def review
    @review && @review[:review] || 0
  end

  def id
    @review && @review[:id] || nil
  end

  def created_at
    time_ago_in_words(@review.updated_at)
  end

  def reviewer
    User.find(@review[:author_id]).first_name
  end
end
