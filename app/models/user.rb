class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  validates :f_name, :l_name, presence: true
  validate :phone_number_format
  validate :profile_src, presence: true, length: {maximum: 150_000}
  
  def image_blob= 
    
  end

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
         
  def phone_number_format
  	unless /(\d{3})-(\d{3})-(\d{4})/.match(phone_number)
  		errors.add(:phone_number, "must follow 555-555-5555 format")
  	end
  end
end
