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
    description: 'some text'
})

Program.create({
    name: 'Test1',
    url_slug: 'test1'
})

Program.create({
    name: 'Test2',
    url_slug: 'test2'
})

Program.create({
    name: 'Test3',
    url_slug: 'test3'
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

if user.present?
  user.roles << Role.find_by_url_slug('admin')
  user.save!
end

AboutPage.create({
    description: 'about page in English',
    spanish_description: 'about page in Spanish',
})

FaqPage.create({
    description: 'FAQ page in English',
    spanish_description: 'FAQ page in Spanish',
})
