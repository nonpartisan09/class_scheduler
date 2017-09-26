class User < ActiveRecord::Base
  include HasUrl
  has_and_belongs_to_many :roles

  devise :rememberable,
      :database_authenticatable,
      :registerable,
      :trackable,
      :recoverable,
      :validatable

  validates_confirmation_of :password

  validates :email, :display_name, :url_slug, presence: true, uniqueness: true

  def self.authentication_keys
    [ :email ]
  end

  def self.remember_for
    12.months
  end

  def admin?
    #todo
  end

  def remember_me
    true
  end

  private

  def self.field_used_for_url_slug
    :display_name
  end
end
