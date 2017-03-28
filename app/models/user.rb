class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  attr_accessor :image, :language

  validates :f_name, :l_name, :phone_number, presence: true
  validates :language, presence: {in: Language::ALL}
  validate :phone_number_format
  validate :image_uploaded # hybrid upload/validator function

  has_one :primary_language,
    as: :owner,
    class_name: :Language,
    dependent: :destroy,
    autosave: true

  def language=(language)
    @language = language
    self.primary_language = Language.new(language: language, owner: self)
  end

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
