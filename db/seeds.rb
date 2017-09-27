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
    name: 'Student',
    url_slug: 'student',
    description: 'A student',
    displayable: true
})

TermsAndConditions.create({
    description: 'some text',
    version: 1
})
