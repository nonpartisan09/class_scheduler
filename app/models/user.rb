class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  LANGUAGES = ["eng", "spa"] 
      
  attr_accessor :image

  validates :f_name, :l_name, :phone_number, :language, presence: true
  validates :language, inclusion: {in: LANGUAGES}
  validate :phone_number_format
  validate :image_uploaded # hybrid upload/validator function
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable



  private 

  def image_uploaded
    if (!image || image == "") && !self.profile_src
      errors.add(:image, "must be present")
      return
    elsif (image && image != "")
      upload = Cloudinary::Uploader.upload(image)
      self.profile_src = upload["url"]
    end

    errors.add(:image, "upload failed") unless self.profile_src
  end

  def phone_number_format
    return unless phone_number && phone_number != ""
  	unless /(\d{3})-(\d{3})-(\d{4})/.match(phone_number)
  		errors.add(:phone_number, "must follow 555-555-5555 format")
  	end
  end

end
