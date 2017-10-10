FactoryGirl.define do
  factory :role do
    displayable { true }

    after(:build) do |role, proxy|
      if proxy.name.present?
        role.name = proxy.name
      else
        role.name = 'Student'
      end
    end
  end
end
