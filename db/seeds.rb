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

Role.create(
  name: 'Owner',
  url_slug: 'owner',
  description: 'An owner with read and write access to the admin panel',
  displayable: false
)

Role.create(
  name: 'Admin-ReadOnly',
  url_slug: 'admin-readonly',
  description: 'An admin with read-only entitlements',
  displayable: false
)

TermsAndConditions.create(
  description: 'some text'
)

Program.create(
  name: 'English',
  url_slug: 'english',
  description: 'Practice conversational and/or written English with clients.',
  featured: true,
  spanish_name: 'Ingles',
  spanish_description: 'Practicar el inglés conversacional y / o escrito con los clientes/as.'
)

Program.create(
  name: 'Citizenship',
  url_slug: 'citizenship',
  description: 'Prepare clients for the US Naturalization Exam.',
  featured: true,
  spanish_name: 'Ciudadania',
  spanish_description: 'Preparar a los clientes/as para el examen de naturalización de EE. UU..'
)

Program.create(
  name: 'Legal Aid',
  url_slug: 'legalaid',
  featured: false,
  spanish_name: 'Ingles',
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
  user = User.create!(email: 'admin@example.com', first_name: 'Admin', last_name: 'Admin', password: 'password', password_confirmation: 'password')
  owner =  User.create!(email: 'owner@example.com', first_name: 'Owner', last_name: 'Owner', password: 'password', password_confirmation: 'password')
end

if user.present?
  user.roles << Role.find_by_url_slug('admin')
  user.save!
end

if owner.present?
  owner.roles << Role.find_by_url_slug('owner')
  owner.save!
end

AboutPage.create(
  description: 'about page in English',
  spanish_description: 'about page in Spanish'
)

FaqPage.create(
  description: 'FAQ page in English',
  spanish_description: 'FAQ page in Spanish'
)

MainGoal.create(
  name: 'Strengthen resumé for work',
  spanish_name: 'Mejorar mi currículo para trabajar',	
  for_volunteer: true,
  for_client: false,
  displayable: true
)
MainGoal.create(
  name: 'Strengthen resumé for college',
  spanish_name: 'Mejorar mi currículo para trabajar',	
  for_volunteer: true,
  for_client: false,
  displayable: true
)
MainGoal.create(
  name: 'Make a difference in the world',
  spanish_name: 'Hacer la diferencia en el mundo',	
  for_volunteer: true,
  for_client: false,
  displayable: true
)
MainGoal.create(
  name: 'Other',
  spanish_name: 'Otra',	
  for_volunteer: true,
  for_client: false,
  displayable: true
)

MainGoal.create(
  name: 'Get a job or perform better at work',
  spanish_name: 'Consiguir un trabajo o rindir mejor en el trabajo',	
  for_volunteer: false,
  for_client: true,
  displayable: true
)
MainGoal.create(
  name: 'Get a GED or into college',
  spanish_name: 'Obtener un GED o ingresar a la universidad',	
  for_volunteer: false,
  for_client: true,
  displayable: true
)
MainGoal.create(
  name: 'Pass the US citizenship exam',
  spanish_name: 'Aprobar el examen de ciudadanía estadounidense',	
  for_volunteer: false,
  for_client: true,
  displayable: true
)
MainGoal.create(
  name: 'Other',
  spanish_name: 'Otro',	
  for_volunteer: false,
  for_client: true,
  displayable: true
)


# More users (for dev)
if Rails.env.development?
  test_users = [
    { email: 'tom@domain.com', role: 'volunteer',
      first_name: 'Thomas', last_name: 'Jefferson',
      address: '10 1st Avenue', city: 'New York',
      state: 'Ny', country: 'United States',
      locale: 'en', timezone: 'Eastern Time (US & Canada)',
      is_over_18: true, consented_to_background_check: true },
    { email: 'ben@domain.com', role: 'volunteer',
      first_name: 'Ben', last_name: 'Franklin',
      address: '100 1st Avenue', city: 'New York',
      state: 'Ny', country: 'United States',
      locale: 'en', timezone: 'Eastern Time (US & Canada)',
      is_over_18: true, consented_to_background_check: true },
    { email: 'george@domain.com', role: 'client',
      first_name: 'George', last_name: 'Washington',
      address: '100 2nd Avenue', city: 'New York',
      state: 'Ny', country: 'United States',
      locale: 'en', timezone: 'Eastern Time (US & Canada)',
      is_over_18: true, consented_to_background_check: false },
    { email: 'john@domain.com', role: 'client',
      first_name: 'John', last_name: 'Adams',
      address: '100 3rd Avenue', city: 'New York',
      state: 'Ny', country: 'United States',
      locale: 'en', timezone: 'Eastern Time (US & Canada)',
      is_over_18: true, consented_to_background_check: false },
    { email: 'betsy@domain.com', role: 'client',
      first_name: 'Betsy', last_name: 'Ross',
      address: '100 Market St', city: 'Philadelphia',
      state: 'Pa', country: 'United States',
      locale: 'en', timezone: 'Eastern Time (US & Canada)',
      is_over_18: true, consented_to_background_check: false },
    { email: 'dolly@domain.com', role: 'volunteer',
      first_name: 'Dolly', last_name: 'Madison',
      address: '100 Broad St', city: 'Philadelphia',
      state: 'Pa', country: 'United States',
      locale: 'en', timezone: 'Eastern Time (US & Canada)',
      is_over_18: true, consented_to_background_check: true },
    { email: 'kap@domain.com', role: 'volunteer',
      first_name: 'Kapiolani', last_name: 'Alii',
      address: '100 Queen St', city: 'Honolulu',
      state: 'Hi', country: 'United States',
      locale: 'en', timezone: 'Hawaii',
      is_over_18: true, consented_to_background_check: true },
    { email: 'kam@domain.com', role: 'client',
      first_name: 'King', last_name: 'Kamehameha',
      address: '100 Punchbowl St', city: 'Honolulu',
      state: 'Hi', country: 'United States',
      locale: 'en', timezone: 'Hawaii',
      is_over_18: true, consented_to_background_check: false },
    { email: 'cooke@domain.com', role: 'client',
      first_name: 'Capt', last_name: 'Cooke',
      address: '101 Punchbowl St', city: 'Honolulu',
      state: 'Hi', country: 'United States',
      locale: 'en', timezone: 'Hawaii',
      is_over_18: true, consented_to_background_check: false },
    { email: 'rock@domain.com', role: 'volunteer',
      first_name: 'Duane', last_name: 'Johnson',
      address: '99 unknown St', city: 'Honolulu',
      state: 'Hi', country: 'United States',
      locale: 'en', timezone: 'Hawaii',
      is_over_18: true, consented_to_background_check: true },
    { email: 'groucho@domain.com', role: 'client',
      first_name: 'Groucho', last_name: 'Marx',
      address: '', city: '', state: '', country: '',
      locale: 'en', timezone: 'Central Time (US & Canada)',
      is_over_18: true, consented_to_background_check: false },
    { email: 'harpo@domain.com', role: 'client',
      first_name: 'Harpo', last_name: 'Marx',
      address: '', city: '', state: '', country: '',
      locale: 'en', timezone: 'Central Time (US & Canada)',
      is_over_18: true, consented_to_background_check: false },
    { email: 'chico@domain.com', role: 'client',
      first_name: 'Chico', last_name: 'Marx',
      address: '', city: 'Boston',
      state: 'Ma', country: 'United States',
      locale: 'en', timezone: 'Eastern Time (US & Canada)',
      is_over_18: true, consented_to_background_check: false },
    { email: 'lou@domain.com', role: 'client',
      first_name: 'Lou', last_name: 'Costello',
      address: '', city: 'Springfield',
      state: 'Ma', country: 'United States',
      locale: 'en', timezone: 'Eastern Time (US & Canada)',
      is_over_18: true, consented_to_background_check: false },
    { email: 'bud@domain.com', role: 'client',
      first_name: 'Bud', last_name: 'Abbot',
      address: '', city: 'Springfield',
      state: 'Il', country: 'United States',
      locale: 'en', timezone: 'Central Time (US & Canada)',
      is_over_18: true, consented_to_background_check: false }
  ]
  test_users.each do |u|
    user = User.create!(email: u[:email],
                        password: 'password', password_confirmation: 'password',
                        terms_and_conditions: 2, active: true,
                        first_name: u[:first_name], last_name: u[:last_name],
                        address: u[:address], city: u[:city],
                        state: u[:state], country: u[:country],
                        timezone: u[:timezone], locale: u[:locale],
                        is_over_18: u[:is_over_18], consented_to_background_check: u[:consented_to_background_check]
                      )
    user.roles << Role.find_by_url_slug(u[:role])
    user.save!
  end
end
