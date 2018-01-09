class Review < ActiveRecord::Base
  belongs_to :author, class_name: 'User', foreign_key: 'author_id'
  belongs_to :user, class_name: 'User', foreign_key: 'user_id'

  validates :author_id, :user_id, :review, presence: true
  validates_uniqueness_of :user_id, scope: :author_id
end
