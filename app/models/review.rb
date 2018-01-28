class Review < ActiveRecord::Base
  include HasReviewSearch

  belongs_to :author, class_name: 'User', foreign_key: 'author_id'
  belongs_to :user, class_name: 'User'

  validates :author_id, :user_id, :review, presence: true
  validates_uniqueness_of :user_id, scope: :author_id

  validate :check_users_are_different

  def check_users_are_different
    unless self.user_id != self.author_id
      errors.add(:reviewer,'cannot review self')
    end
  end
end
