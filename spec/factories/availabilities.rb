FactoryGirl.define do
  sequence :start_time do |n|
    Time.zone = 'CET'
    day_month= "Sunday, 7 Jan 2001"
    Time.zone.parse("#{day_month} 10:00 #{Time.zone.tzinfo}")
  end
  sequence :end_time do |n|
    Time.zone = 'CET'
    day_month="Sunday, 7 Jan 2001"
    Time.zone.parse("#{day_month} 13:00 #{Time.zone.tzinfo}")
  end

  factory :availability do
    day "Sunday"
    start_time { generate :start_time }
    end_time { generate :end_time }
    user_id { FactoryGirl.create(:user, :volunteer).id }
  end
end
