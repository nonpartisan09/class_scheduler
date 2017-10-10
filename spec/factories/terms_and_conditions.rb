FactoryGirl.define do
  sequence :version do |n|
    n
  end

  factory :terms_and_conditions do
    version
  end
end
