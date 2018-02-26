FactoryBot.define do
  sequence :review do |n|
    rand(1..5)
  end

  sequence :comment do |n|
    "comment #{n}"
  end

  factory :review do
    review { generate :review }
    comment { generate :comment }
    author_id { FactoryBot.create(:user, :volunteer).id }
    after(:build) do |review, proxy|
      if proxy.user.present?

        review.user_id = proxy.user.id
      else
        user_id { FactoryBot.create(:user, :client).id }
      end
    end
  end
end
