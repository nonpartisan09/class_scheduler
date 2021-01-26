FactoryBot.define do
  factory :main_goal do
    name { "MyString" }
    spanish_name { "MyString" }
    for_volunteer { false }
    for_client { false }
    displayable { false }
  end
end
