# frozen_string_literal: true

Role.create(
  name: 'Admin',
  url_slug: 'admin',
  description: 'A volunteer with access to the admin panel',
  displayable: false
)

Role.create(
  name: 'Volunteer',
  url_slug: 'volunteer',
  description: 'A volunteer with no access to the admin panel',
  displayable: true
)

Role.create(
  name: 'Client',
  url_slug: 'client',
  description: 'A client',
  displayable: true
)

TermsAndConditions.create(
  description: 'some text'
)

Program.create(
  name: 'Test1',
  url_slug: 'test1'
)

Program.create(
  name: 'Test2',
  url_slug: 'test2'
)

Program.create(
  name: 'Test3',
  url_slug: 'test3'
)

Language.create(
  name: 'English',
  url_slug: 'english'
)

Language.create(
  name: 'Español',
  url_slug: 'espanol'
)

HowTheyFoundUsOption.create(
  name: 'Yellow Pages',
  spanish_name: 'páginas amarillas',
  for_volunteer: true,
  for_client: true
)

if Rails.env.development?
  user = User.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password')
end

if user.present?
  user.roles << Role.find_by_url_slug('admin')
  user.save!
end

AboutPage.create(
  description: 'about page in English',
  spanish_description: 'about page in Spanish'
)

FaqPage.create(
  description: 'FAQ page in English',
  spanish_description: 'FAQ page in Spanish'
)

# More users (for dev)
if Rails.env.development?
  test_users = [
    { email: 'tom@domain.com', role: 'volunteer',
      first_name: 'Thomas', last_name: 'Jefferson',
      address: '10 1st Avenue', city: 'New York',
      state: 'Ny', country: 'usa',
      locale: 'en', timezone: 'Eastern Time (US & Canada)' },
    { email: 'ben@domain.com', role: 'volunteer',
      first_name: 'Ben', last_name: 'Franklin',
      address: '100 1st Avenue', city: 'New York',
      state: 'Ny', country: 'usa',
      locale: 'en', timezone: 'Eastern Time (US & Canada)' },
    { email: 'george@domain.com', role: 'client',
      first_name: 'George', last_name: 'Washington',
      address: '100 2nd Avenue', city: 'New York',
      state: 'Ny', country: 'usa',
      locale: 'en', timezone: 'Eastern Time (US & Canada)' },
    { email: 'john@domain.com', role: 'client',
      first_name: 'John', last_name: 'Adams',
      address: '100 3rd Avenue', city: 'New York',
      state: 'Ny', country: 'usa',
      locale: 'en', timezone: 'Eastern Time (US & Canada)' },
    { email: 'betsy@domain.com', role: 'client',
      first_name: 'Betsy', last_name: 'Ross',
      address: '100 Market St', city: 'Philadelphia',
      state: 'Pa', country: 'usa',
      locale: 'en', timezone: 'Eastern Time (US & Canada)' },
    { email: 'dolly@domain.com', role: 'volunteer',
      first_name: 'Dolly', last_name: 'Madison',
      address: '100 Broad St', city: 'Philadelphia',
      state: 'Pa', country: 'usa',
      locale: 'en', timezone: 'Eastern Time (US & Canada)' },
    { email: 'kap@domain.com', role: 'volunteer',
      first_name: 'Kapiolani', last_name: 'Alii',
      address: '100 Queen St', city: 'Honolulu',
      state: 'Hi', country: 'usa',
      locale: 'en', timezone: 'Hawaii' },
    { email: 'kam@domain.com', role: 'client',
      first_name: 'King', last_name: 'Kamehameha',
      address: '100 Punchbowl St', city: 'Honolulu',
      state: 'Hi', country: 'usa',
      locale: 'en', timezone: 'Hawaii' },
    { email: 'cooke@domain.com', role: 'client',
      first_name: 'Capt', last_name: 'Cooke',
      address: '101 Punchbowl St', city: 'Honolulu',
      state: 'Hi', country: 'usa',
      locale: 'en', timezone: 'Hawaii' },
    { email: 'rock@domain.com', role: 'volunteer',
      first_name: 'Duane', last_name: 'Johnson',
      address: '99 unknown St', city: 'Honolulu',
      state: 'Hi', country: 'usa',
      locale: 'en', timezone: 'Hawaii' },
    { email: 'groucho@domain.com', role: 'client',
      first_name: 'Groucho', last_name: 'Marx',
      address: '', city: '', state: '', country: '',
      locale: 'en', timezone: 'Central Time (US & Canada)' },
    { email: 'harpo@domain.com', role: 'client',
      first_name: 'Harpo', last_name: 'Marx',
      address: '', city: '', state: '', country: '',
      locale: 'en', timezone: 'Central Time (US & Canada)' },
    { email: 'chico@domain.com', role: 'client',
      first_name: 'Chico', last_name: 'Marx',
      address: '', city: 'Boston',
      state: 'Ma', country: 'usa',
      locale: 'en', timezone: 'Eastern Time (US & Canada)' },
    { email: 'lou@domain.com', role: 'client',
      first_name: 'Lou', last_name: 'Costello',
      address: '', city: 'Springfield',
      state: 'Ma', country: 'usa',
      locale: 'en', timezone: 'Eastern Time (US & Canada)' },
    { email: 'bud@domain.com', role: 'client',
      first_name: 'Bud', last_name: 'Abbot',
      address: '', city: 'Springfield',
      state: 'Il', country: 'usa',
      locale: 'en', timezone: 'Central Time (US & Canada)' }
  ]
  test_users.each do |u|
    user = User.create!(email: u[:email],
                        password: 'password', password_confirmation: 'password',
                        terms_and_conditions: 2, active: true,
                        first_name: u[:first_name], last_name: u[:last_name],
                        address: u[:address], city: u[:city],
                        state: u[:state], country: u[:country],
                        timezone: u[:timezone], locale: u[:locale])
    user.roles << Role.find_by_url_slug(u[:role])
    user.save!
  end
end
