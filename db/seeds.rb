# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Role.create({
    name: 'Admin',
    url_slug: 'admin',
    description: 'A volunteer with access to the admin panel',
    displayable: false
})

Role.create({
    name: 'Volunteer',
    url_slug: 'volunteer',
    description: 'A volunteer with no access to the admin panel',
    displayable: true
})

Role.create({
    name: 'Client',
    url_slug: 'client',
    description: 'A client',
    displayable: true
})

TermsAndConditions.create({
    description: 'some text',
    version: 1,
    id: 1
})

Program.create({
    name: 'Test1',
    url_slug: '99ea7bf70f6e69ad71659995677b43f8a83120252'
})

Program.create({
    name: 'Test2',
    url_slug: '2b84f621c0fd4ba8bd514c5c43ab9a897c8c014e4'
})

Program.create({
    name: 'Test3',
    url_slug: '5e595222cbfbfb16faea2f3a75daea5986605b178'
})

Language.create({
    name: 'English',
    url_slug: 'english'
})

Language.create({
    name: 'Español',
    url_slug: 'espanol'
})

user = User.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password') if Rails.env.development?

unless user.present?
  user.roles = Role.find_by_url_slug('admin')
  user.save!
end
