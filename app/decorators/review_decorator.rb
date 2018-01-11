class ReviewDecorator
  attr_reader :review

  def initialize(review)
    @review = review
  end

  def decorate
    {
        :review => review,
        :id => id
    }
  end

  def review
    @review && @review[:review]
  end

  def id
    @review && @review[:id]
  end
end
