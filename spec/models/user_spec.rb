require 'rails_helper'

RSpec.describe User, type: :model do
  subject { described_class.new(password: "some_password", email: "john@doe.com") }

  it { is_expected.to have_many(:authored_conversations).class_name('Conversation') }
  it { is_expected.to have_many(:received_conversations).class_name('Conversation') }
  it { is_expected.to have_many(:messages).dependent(:destroy) }

  it { is_expected.to have_and_belong_to_many(:roles) }
  it { is_expected.to have_and_belong_to_many(:languages) }

  it { is_expected.to have_many(:programs).through(:enrollments) }
  it { is_expected.to have_many(:availabilities).dependent(:destroy) }
  it { is_expected.to have_many(:enrollments) }

  it { is_expected.to validate_presence_of(:email) }
  it { is_expected.to validate_uniqueness_of(:email).case_insensitive }

  it { is_expected.to validate_uniqueness_of(:url_slug) }

  it { is_expected.to have_attached_file(:thumbnail_image) }
  it { is_expected.to validate_attachment_content_type(:thumbnail_image).
      allowing('image/png', 'image/gif', 'image/jpeg').
      rejecting('text/plain', 'text/xml') }
  it { is_expected.to validate_attachment_size(:thumbnail_image).
      less_than(200.megabytes) }

  it { is_expected.to have_db_column(:first_name).of_type(:string) }
  it { is_expected.to have_db_column(:last_name).of_type(:string) }
  it { is_expected.to have_db_column(:timezone).of_type(:string).with_options(default: "UTC") }
  it { is_expected.to have_db_column(:email).of_type(:string) }
  it { is_expected.to have_db_column(:url_slug).of_type(:string) }

  it { is_expected.to have_db_column(:active).of_type(:boolean) }
  it { is_expected.to have_db_column(:generated_password).of_type(:boolean) }

  it { is_expected.to have_db_column(:address).of_type(:string) }
  it { is_expected.to have_db_column(:city).of_type(:string) }
  it { is_expected.to have_db_column(:state).of_type(:string) }
  it { is_expected.to have_db_column(:country).of_type(:string) }

  it { is_expected.to have_db_column(:description).of_type(:text) }

  it { is_expected.to have_db_column(:latitude).of_type(:float) }
  it { is_expected.to have_db_column(:longitude).of_type(:float) }

  it { is_expected.to have_db_column(:average_rating).of_type(:integer) }
  it { is_expected.to have_db_column(:rating_count).of_type(:integer) }

  it { is_expected.to have_db_column(:terms_and_conditions).of_type(:integer) }
  it { is_expected.to have_db_column(:contact_permission).of_type(:boolean) }
  it { is_expected.to have_db_column(:email_notification).of_type(:boolean) }

  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }

  it { is_expected.to have_db_index(:email) }

  it 'is not valid without a password' do
    subject.password = nil
    expect(subject).to_not be_valid
  end

  describe "#all_conversations_timely?" do
    subject(:all_conversations_timely) { volunteer.all_conversations_timely? }

    let(:volunteer) { FactoryBot.create(:volunteer_user) }
    let(:client) { FactoryBot.create(:client_user) }
    let(:conversation) { FactoryBot.create(:conversation, author_id: client.id, recipient_id: volunteer.id) }
    let!(:message) { FactoryBot.create(:message, conversation_id: conversation.id, user_id: client.id, created_at: DateTime.now - 3.days) }

    it "returns false if user has an untimely conversation" do
      volunteer.audit_conversations

      expect(all_conversations_timely).to be false
    end

    it "return true if user has no untimely conversations" do
      conversation.messages.create(user_id: volunteer.id, body: "this is a timely response")
      volunteer.audit_conversations

      expect(all_conversations_timely).to be true
    end
  end

  describe "audit_conversations" do
    subject(:volunteer) { FactoryBot.create(:volunteer_user) }

    let(:client) { FactoryBot.create(:client_user) }
    let(:audit_conversations) { volunteer.audit_conversations }
    let(:conversation) { FactoryBot.create(:conversation, author_id: client.id, recipient_id: volunteer.id) }
    let!(:message) { FactoryBot.create(:message, conversation_id: conversation.id, user_id: client.id, created_at: DateTime.now - 3.days) }

    it "unresponsive user is not marked unresponsive or timeout before the audit" do
      aggregate_failures do
        expect(subject).to_not be_timeout
        expect(subject).to_not be_unresponsive
      end
    end

    it "unresponsive user is marked unresponsive and timeout after the audit" do
      audit_conversations

      aggregate_failures do
        expect(subject).to be_timeout
        expect(subject).to be_unresponsive
      end
    end

    it "never marks a client as unresponsive or timeout" do
      aggregate_failures do
        expect(client).to_not be_timeout
        expect(client).to_not be_unresponsive
      end

      client.audit_conversations

      aggregate_failures do
        expect(client).to_not be_timeout
        expect(client).to_not be_unresponsive
      end
    end
  end

  def create_timely_conversation(client, volunteer)
    convo = Conversation.create(author_id: client.id, recipient_id: volunteer.id)
    FactoryBot.create(:message, conversation: convo, user_id: client.id, created_at: DateTime.now - 3.days)
    FactoryBot.create(:message, conversation: convo, user_id: volunteer.id, created_at: DateTime.now)
  end
end