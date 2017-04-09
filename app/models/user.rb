class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  has_one :image,
    as: :owner

  accepts_nested_attributes_for :image
      
  validates :first_name, :last_name, :language, :about, :image, presence: true
  validates :password, confirmation: true 
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

end