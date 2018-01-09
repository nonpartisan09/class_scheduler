class ReviewDecorator
  attr_reader :review

  def initialize(review)
    @review = review
  end

  def decorate
    @review && @review[:review] ||= 0
  end
end
