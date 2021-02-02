class UsersGenderIdentity < ApplicationRecord
  belongs_to :user
  belongs_to :gender_identity
end
