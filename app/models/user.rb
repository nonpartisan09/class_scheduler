class User < ApplicationRecord
  
  has_one :image,
    as: :owner,
    autosave: true,
    dependent: :destroy,
    inverse_of: :owner

  accepts_nested_attributes_for :image
  
  attr_reader :password
  attr_accessor :guest

  validates :email, :password_digest, :session_token, presence: true
  validates :email, uniqueness: true
  validates :password, length: {minimum: 6}, allow_nil: :true
  validates :password, confirmation: true 
  
  validates :first_name, :last_name, :language, :about, :image, presence: true

  after_initialize :ensure_session_token, :ensure_guest_status
  before_validation :ensure_session_token_uniqueness

  has_many :favorites

  def password= password
    self.password_digest = BCrypt::Password.create(password)
    @password = password
  end

  def self.find_by_credentials email, password
    user = User.find_by(email: email)
    return nil unless user
    user.password_is?(password) ? user : nil
  end

  def password_is? password
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def reset_session_token!
    self.update!(session_token: new_session_token)
    self.session_token
  end

  private

  def ensure_session_token
    self.session_token ||= new_session_token
  end

  def new_session_token
    SecureRandom.base64
  end

  def ensure_session_token_uniqueness
    while User.find_by(session_token: self.session_token)
      self.session_token = new_session_token
    end
  end

  def ensure_guest_status
    self.guest ||= false
  end

end