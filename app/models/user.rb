class User < ActiveRecord::Base
  include HasUrlSlug, HasSearch, ActsAsMessageable
  has_and_belongs_to_many :roles, :join_table => :roles_users
  has_many :enrollments
  has_many :programs, through: :enrollments

  has_many :availabilities, dependent: :destroy

  geocoded_by :full_address
  after_validation :geocode, if: ->(obj) { obj.full_address.present? }

  has_attached_file :thumbnail_image,
        styles: { thumbnail: ["550x310", :jpg] },
        path: ":rails_root/public/system/:class/:attachment/:id_partition/:style/:basename.:extension",
        url: "#{ Rails.configuration.static_base_url }/:class/:attachment/:id_partition/:style/:basename.:extension"

  validates_attachment :thumbnail_image, content_type: { content_type: ["image/jpg", "image/jpeg", "image/png", "image/gif"] }

  devise :rememberable,
      :database_authenticatable,
      :registerable,
      :trackable,
      :recoverable,
      :validatable,
      password_length: 8..30

  validates_confirmation_of :password

  validates :timezone, presence: true
  validates :email, :url_slug, presence: true, uniqueness: true

  scope :volunteer, -> { includes(:roles).where({:roles => {:url_slug => 'volunteer'}})}
  scope :client, -> { includes(:roles).where({:roles => {:url_slug => 'client'}})}

  def self.authentication_keys
    [ :email ]
  end

  def self.remember_for
    12.months
  end

  def admin?
    self.roles.where(:url_slug => 'admin').present?
  end

  def volunteer?
    self.roles.where(:url_slug => 'volunteer').present?
  end

  def client?
    self.roles.where(:url_slug => 'client').present?
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
