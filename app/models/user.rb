class User < ActiveRecord::Base
  include HasUrlSlug, HasSearch
  has_and_belongs_to_many :roles, :join_table => :roles_users
  has_many :enrollments
  has_many :courses, through: :enrollments

  has_many :availabilities, dependent: :destroy

  geocoded_by :full_address
  after_validation :geocode

  has_attached_file :thumbnail_image,
        styles: { thumbnail: ["550x310", :jpg] }

  validates_attachment :thumbnail_image, content_type: { content_type: ["image/jpg", "image/jpeg", "image/png", "image/gif"] }

  devise :rememberable,
      :database_authenticatable,
      :registerable,
      :trackable,
      :recoverable,
      :validatable,
      password_length: 8..30

  validates_confirmation_of :password

  validates :email, :url_slug, presence: true, uniqueness: true

  scope :teacher, -> { includes(:roles).where({:roles => {:url_slug => 'volunteer'}})}
  scope :student, -> { includes(:roles).where({:roles => {:url_slug => 'student'}})}

  def self.authentication_keys
    [ :email ]
  end

  def self.remember_for
    12.months
  end

  def admin?
    self.roles.where(:url_slug => 'admin').present?
  end

  def teacher?
    self.roles.where(:url_slug => 'volunteer').present?
  end

  def student?
    self.roles.where(:url_slug => 'student').present?
  end

  def remember_me
    true
  end

  def field_used_for_url_slug
    :email
  end

  def full_address
    "#{address} #{city}"
  end
end
