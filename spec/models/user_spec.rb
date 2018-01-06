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
  it { is_expected.to validate_uniqueness_of(:email) }

  it { is_expected.to validate_uniqueness_of(:url_slug) }

  it { is_expected.to have_attached_file(:thumbnail_image) }
  it { is_expected.to validate_attachment_content_type(:thumbnail_image).
      allowing('image/png', 'image/gif').
      rejecting('text/plain', 'text/xml') }
  it { is_expected.to validate_attachment_size(:thumbnail_image).
      less_than(2.megabytes) }

  it { is_expected.to have_db_column(:first_name).of_type(:string) }
  it { is_expected.to have_db_column(:last_name).of_type(:string) }
  it { is_expected.to have_db_column(:timezone).of_type(:string).with_options(default: "UTC") }
  it { is_expected.to have_db_column(:email).of_type(:string) }
  it { is_expected.to have_db_column(:url_slug).of_type(:string) }

  it { is_expected.to have_db_column(:address).of_type(:string) }
  it { is_expected.to have_db_column(:city).of_type(:string) }
  it { is_expected.to have_db_column(:description).of_type(:text) }

  it { is_expected.to have_db_column(:latitude).of_type(:float) }
  it { is_expected.to have_db_column(:longitude).of_type(:float) }

  it { is_expected.to have_db_column(:terms_and_conditions).of_type(:integer) }
  it { is_expected.to have_db_column(:contact_permission).of_type(:boolean) }

  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }

  it { is_expected.to have_db_index(:email) }

  it 'is not valid without a password' do
    subject.password = nil
    expect(subject).to_not be_valid
  end
end
