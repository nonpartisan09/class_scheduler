# frozen_string_literal: true

class User < ActiveRecord::Base
  include IsUpdateable
  include ActsAsMessageable
  include HasUserSearch
  include HasUrlSlug
  include Warden

  has_many :users_ethnicity_races, dependent: :destroy
  has_many :ethnicity_races, through: :users_ethnicity_races

  has_many :users_gender_identities, dependent: :destroy
  has_many :gender_identities, through: :users_gender_identities

  has_many :users_meeting_options, dependent: :destroy
  has_many :meeting_options, through: :users_meeting_options

  has_many :user_main_goals, dependent: :destroy
  has_many :main_goals, through: :user_main_goals

  has_and_belongs_to_many :roles
  accepts_nested_attributes_for :roles

  has_and_belongs_to_many :languages
  accepts_nested_attributes_for :languages

  has_many :enrollments, dependent: :destroy
  has_many :programs, through: :enrollments

  has_many :authored_reviews, class_name: 'Review', foreign_key: 'author_id', dependent: :destroy
  has_many :received_reviews, class_name: 'Review', foreign_key: 'user_id', dependent: :destroy

  has_many :availabilities, dependent: :destroy

  has_many :received_conversations, class_name: 'Conversation', foreign_key: 'recipient_id'

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

  # Added as a class method to avoid n+1 query when performing User::responsive? for each
  # user from ResponsiveUsersJob
  def self.all_responsive?
    users = User.all.includes(received_conversations: :messages)
    User.audit_conversations(users)
  end
  
  # `User::responsive?` checks if any conversations older than 48 hours have no volunteer 
  # response by iterateing through every message of every conversation for the user.
  # “Premature optimization is the root of all evil”
  def responsive?
    User.audit_conversations([self])[0]
  end

  # creates a timeout and send email for use when volunteers is unresponsive
  def create_timeout(conversation)
    return if timeout # no need to send email or update record if already timed out

    self.update!(timeout: true)
    client = conversation.author
    program = client.programs.first # currenttly we are not saving the program selected to conversation, this is a stopgap measure

    UserMailer.unresponsive_volunteer(self, client, conversation, program).deliver_later
    if client.locale == "en"
      UserMailer.unresponsive_client_eng(self, client, conversation, program).deliver_later
    elsif client.locale == "es"
      UserMailer.unresponsive_client_esp(self, client, conversation, program).deliver_later
    end
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

  def self.audit_conversations(users)
    res = users.map do |user|
      conversation = nil

      responsive = user.received_conversations.all? do |convo, idx| 
        time_difference = (Time.now.utc - convo.created_at)/3600 # converted to hours
        messages = convo.messages
        has_responded = messages.any?{|msg| msg.user_id == user.id} # check if the volunteer has any sent messages in the conversation
        conversation = convo #all loop breaks when expression is false, so conversation will be saved as the last 'delinquent' conversation checked
        
        has_responded || time_difference < 48 # no response is ok if the conversation was started less than 48 hours ago
      end

      # timeout the volunteer and send out an email to client and user with an update
      user.create_timeout(conversation) if !responsive
      responsive
    end

    res
  end
end
