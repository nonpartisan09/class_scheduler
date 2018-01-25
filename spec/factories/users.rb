FactoryGirl.define do
  sequence :email do |n|
    "email@domain#{n}.com"
  end

  sequence :first_name do |n|
    "FirstName #{n}"
  end

  sequence :last_sign_in_at do |n|
    DateTime.now
  end

  sequence :url_slug do |n|
    "url-slug-#{n}"
  end

  sequence :average_rating do
   rand(1..5)
  end

  sequence :rating_count do
    rand(1..100)
  end

  factory :user do
    first_name { generate :first_name }
    email { generate :email }
    last_sign_in_at { generate :last_sign_in_at }
    password 'password'
    url_slug
    active true
    terms_and_conditions true
    timezone 'UTC'
    programs Program.all
    languages Language.all
    average_rating { generate :average_rating }
    rating_count { generate :rating_count }
  end

  trait :client do
    roles = []
    roles << Role.find_by_name('Client')

    roles { roles }
  end

  trait :volunteer do
    roles = []
    roles << Role.find_by_name('Volunteer')

    roles { roles }
  end
end
