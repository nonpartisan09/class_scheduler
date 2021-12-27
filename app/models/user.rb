# frozen_string_literal: true

class User < ActiveRecord::Base
  include IsUpdateable
  include ActsAsMessageable
  include HasUserSearch
  include HasUrlSlug
  include Warden

  has_and_belongs_to_many :roles
  accepts_nested_attributes_for :roles

  has_and_belongs_to_many :languages
  accepts_nested_attributes_for :languages

  has_many :enrollments
  has_many :programs, through: :enrollments

  has_many :authored_reviews, class_name: 'Review', foreign_key: 'author_id', dependent: :destroy
  has_many :received_reviews, class_name: 'Review', foreign_key: 'user_id', dependent: :destroy

  has_many :availabilities, dependent: :destroy

  has_many :received_conversations, class_name: 'Conversation', foreign_key: 'recipient_id'
  has_many :authored_conversations, class_name: 'Conversation', foreign_key: 'author_id'

  geocoded_by :full_address
  after_validation :geocode, if: ->(obj) { obj.full_address.present? }

  has_attached_file :thumbnail_image,
                    styles: { thumbnail: ['550x310', :jpg] },
                    path: ':rails_root/public/system/:class/:attachment/:id_partition/:style/:basename.:extension',
                    url: "#{Rails.configuration.static_base_url}/:class/:attachment/:id_partition/:style/:basename.:extension"

  validates_attachment :thumbnail_image, size: { in: 0..200.megabytes },
                                         content_type: { content_type: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'] }

  devise :rememberable,
         :database_authenticatable,
         :registerable,
         :trackable,
         :recoverable,
         :validatable,
         password_length: 8..30

  validates_confirmation_of :password

  validates :timezone, :email, :locale, presence: true
  validates_uniqueness_of :email

  scope :volunteers, -> { includes(:roles).where(roles: { url_slug: 'volunteer' }) }
  scope :clients, -> { includes(:roles).where(roles: { url_slug: 'client' }) }
  scope :admins, -> { includes(:roles).where(roles: { url_slug: 'admin' }) }
  scope :owners, -> { includes(:roles).where(roles: { url_slug: 'owner' }) }
  scope :admins_readonly, -> { includes(:roles).where(roles: { url_slug: 'admin-readonly' }) }
  scope :with_availabilities, -> { includes(:availabilities).where.not(availabilities: { id: nil }) }

  scope :active, -> { where(active: true) }
  scope :timed_out, -> { where(timeout: true) }

  def self.authentication_keys
    [:email]
  end

  def self.remember_for
    12.months
  end

  def admin?
    roles.where(url_slug: 'admin').present?
  end

  def admins_readonly?
    roles.where(url_slug: 'admin-readonly').present?
  end

  def owner?
    roles.where(url_slug: 'owner').present?
  end

  def volunteer?
    roles.where(url_slug: 'volunteer').present?
  end

  def client?
    roles.where(url_slug: 'client').present?
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
    save!

    UserMailer.account_deactivated(self).deliver_later
  end

  def delete_with_email!
    UserMailer.account_deleted(self).deliver_later

    destroy
  end

  def activate_account!
    self.active = true
    save!

    if client?
      UserMailer.account_reactivated(self).deliver_later
    else
      UserMailer.account_activated(self).deliver_later
    end
  end

  def unresponsive!(convo)
    self.update!(unresponsive: true, timeout: true)
    self.send_unresponsive_email(convo)
  end

  def admin_user_creation!
    generated_password = Devise.friendly_token.first(8)
    self.password = generated_password
    self.password_confirmation = generated_password
    self.terms_and_conditions = TermsAndConditions.last.id
    save!

    if client?
      UserMailer.client_welcome_email(self, generated_password).deliver_later
    elsif volunteer?
      UserMailer.volunteer_welcome_email(self, generated_password).deliver_later
    end 

    self
  end

  # cities
  def self.cities
    # all cities will contain nil and "" city names
    all_cities = User.where(active: true).distinct.pluck(:city, :state)

    known_cities = []
    unknown_cities = []
    all_cities.each do |cs|
      city = cs[0]
      state = cs[1]
      city_item = {
        name: city,
        client_count: city_client_count(city, state),
        volunteer_count: city_volunteer_count(city, state),
        coordinates: city_coordinates(city, state)
      }
      if city_item[:name].blank? || city_item[:coordinates].nil?
        unknown_cities.push city_item
      else
        known_cities.push city_item
      end
    end

    nyc = known_cities.find_index { |c| c[:name] == 'New York' }
    unknown_cities.each do |u|
      known_cities[nyc][:client_count] += u[:client_count]
      known_cities[nyc][:volunteer_count] += u[:volunteer_count]
    end
    known_cities
  end

  # creates a timeout and send email for use when volunteers is unresponsive
  def send_unresponsive_email(conversation)
    client = conversation.author
    program = client.programs.first # currenttly we are not saving the program selected to conversation, this is a stopgap measure

    UserMailer.unresponsive_volunteer(self, client, conversation, program).deliver_later
    if client.locale == "es"
      UserMailer.unresponsive_client_esp(self, client, conversation, program).deliver_later
    else # client.locale == "en"
      UserMailer.unresponsive_client_eng(self, client, conversation, program).deliver_later
    end
  end

  def all_conversations_timely?
    received_conversations.all?(&:timely)
  end

  def audit_conversations
    received_conversations.each { |convo| audit_conversation(convo) }
    all_conversations_timely? && unresponsive? && update!(unresponsive: false)
  end

  def audit_conversation(conversation)
    unresponsive!(conversation) unless conversation.check_timely && conversation.timely?
  end

  def self.audit_conversations
    users = User.all.includes(received_conversations: :messages)
    users.each(&:audit_conversations)
  end

  private

  def self.city_client_count(city, state)
    User.select('roles.name')
        .where(active: true, city: city, state: state)
        .joins(:roles).where("roles.name = 'Client'").count
  end

  def self.city_volunteer_count(city, state)
    User.select('roles.name')
        .where(active: true, city: city, state: state)
        .joins(:roles).where("roles.name = 'Volunteer'").count
  end

  def self.city_coordinates(city, state)
    # Same city may show up multiple times with different
    # lat/longs (or none at all!). Just picking 1st non nil.
    # If all have nil lat/long, coordinates will be []
    coordinates = User.where(city: city, state: state)
                      .where.not(latitude: nil)
                      .limit(1)
                      .pluck('latitude', 'longitude')
    coordinates[0]
  end
end
