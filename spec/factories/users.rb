FactoryGirl.define do
  sequence :email do |n|
    "email@domain#{n}.com"
  end

  sequence :display_name do |n|
    "UserName #{n}"
  end

  sequence :url_slug do |n|
    "url-slug-#{n}"
  end

  factory :user do
    email { generate :email }
    password 'password'
    url_slug

    terms_and_conditions true
  end
end
