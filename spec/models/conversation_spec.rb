require 'rails_helper'

RSpec.describe Conversation, type: :model do

  it { is_expected.to belong_to(:author).class_name('User') }
  it { is_expected.to belong_to(:recipient).class_name('User') }

  it { is_expected.to validate_presence_of(:author_id) }
  it { is_expected.to validate_uniqueness_of(:author_id).scoped_to(:recipient_id) }

  it { is_expected.to have_many(:messages).dependent(:destroy) }

  it { is_expected.to have_db_column(:author_id).of_type(:integer) }
  it { is_expected.to have_db_column(:recipient_id).of_type(:integer) }
  it { is_expected.to have_db_index([:author_id, :recipient_id]) }

  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }

  describe 'Conversation::is_timely?' do
    let(:conversation) { FactoryBot.create(:conversation) }
    
    it 'returns false if volunteer has not responded for more than 48 hours' do
      conversation.messages.create({body: "this is a test", user_id: conversation.author_id, created_at: "2001-01-06 05:00:00"})
      expect(conversation.is_timely?).to eq(false)
    end
    
    it 'returns true if the message is less than 48 hours old' do
      conversation.messages.create({body: "this is a test", user_id: conversation.author_id})
      expect(conversation.is_timely?).to eq(true)
    end
    
    it 'returns true if the volunteer has responded' do
      conversation.messages.create({body: "this is a test", user_id: conversation.author_id})
      conversation.messages.create({body: "another message", user_id: conversation.recipient_id})
      expect(conversation.is_timely?).to eq(true)
    end
  end
end
