FactoryBot.define do
  factory :program do

    after(:build) do |program, proxy|
      if proxy.name.present?
        program.name = proxy.name
      else
        program.name = 'Test'
      end
    end
  end
end
