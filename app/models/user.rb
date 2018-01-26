class User < ActiveRecord::Base
  include HasUrlSlug, HasUserSearch, ActsAsMessageable, IsUpdateable
  include Warden

  has_and_belongs_to_many :roles
  accepts_nested_attributes_for :roles

  has_and_belongs_to_many :languages
  accepts_nested_attributes_for :languages

  has_many :enrollments
  has_many :programs, through: :enrollments

  has_many :reviews, dependent: :destroy
  accepts_nested_attributes_for :reviews

  has_many :availabilities, dependent: :destroy

  geocoded_by :full_address
  after_validation :geocode, if: ->(obj) { obj.full_address.present? }

  has_attached_file :thumbnail_image,
        styles: { thumbnail: ["550x310", :jpg] },
        path: ":rails_root/public/system/:class/:attachment/:id_partition/:style/:basename.:extension",
        url: "#{ Rails.configuration.static_base_url }/:class/:attachment/:id_partition/:style/:basename.:extension"

  validates_attachment :thumbnail_image, size: { in: 0..200.megabytes },
  content_type: { content_type: ["image/jpg", "image/jpeg", "image/png", "image/gif"] }

  devise :rememberable,
      :database_authenticatable,
      :registerable,
      :trackable,
      :recoverable,
      :validatable,
      password_length: 8..30

  validates_confirmation_of :password

  validates :timezone, presence: true
  validates :email, presence: true
  validates_uniqueness_of :email

  scope :volunteers, -> { includes(:roles).where({:roles => {:url_slug => 'volunteer'}}) }
  scope :clients, -> { includes(:roles).where({:roles => {:url_slug => 'client'}}) }
  scope :admins, -> { includes(:roles).where({:roles => {:url_slug => 'admin'}}) }
  scope :active, -> { where({:active => true }) }

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
    "#{address} #{city} #{state} #{country}"
  end

  def deactivate_account!
    self.active = false
    self.save!

    UserMailer.account_deactivated(self).deliver_later
  end

  def activate_account!
    self.active = true
    self.save!

    UserMailer.account_reactivated(self).deliver_later
  end

  def admin_user_creation!
    generated_password = Devise.friendly_token.first(8)
    self.password = generated_password
    self.password_confirmation = generated_password
    self.terms_and_conditions = TermsAndConditions.last.id
    self.save!

    UserMailer.welcome_email(self, generated_password).deliver_later

    self
  end
end
