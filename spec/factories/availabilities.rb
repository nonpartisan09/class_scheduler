FactoryGirl.define do
  sequence :start_time do |n|
    DateTime.now
  end
  sequence :end_time do |n|
    DateTime.now + 1.hours
  end

  factory :availability do
    day "Sunday"
    start_time { generate :start_time }
    end_time { generate :end_time }
    user_id { FactoryGirl.create(:user, :volunteer).id }
  end


end
