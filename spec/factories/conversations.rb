FactoryBot.define do
  factory :conversation do
    author_id { create(:user).id }
    recipient_id { create(:user).id }

    after(:build) do |conversation, proxy|
      if proxy.author_id.present?
        conversation.author_id = proxy.author_id
      end

      if proxy.recipient_id.present?
        conversation.recipient_id = proxy.recipient_id
      end
    end
  end
end
