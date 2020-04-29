FactoryBot.define do
  factory :message do
    before(:build) do |message, proxy|
      if proxy.user.present?
        message.conversation_id { create(:conversation, { recipient_id: proxy.user.id }).id }
      else
        message.conversation_id { create(:conversation).id }
      end
    end

    subject { "TestSubject" }
    body { "TestBody" }
    user { FactoryBot.create(:user) }
  end
end
