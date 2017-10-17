require 'rails_helper'

RSpec.describe User, type: :model do
  subject { described_class.new(password: "some_password", email: "john@doe.com") }

  it { is_expected.to have_and_belong_to_many(:roles) }
  it { is_expected.to have_many(:courses).through(:enrollments) }

  it { is_expected.to have_db_column(:contact_permission).of_type(:boolean) }
  it { is_expected.to have_db_column(:terms_and_conditions).of_type(:integer) }

  it { is_expected.to validate_presence_of(:email) }
  it { is_expected.to validate_uniqueness_of(:email) }

  it { is_expected.to validate_uniqueness_of(:url_slug) }

  it { is_expected.to have_db_column(:first_name).of_type(:string) }
  it { is_expected.to have_db_column(:last_name).of_type(:string) }

  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }

  it 'is not valid without a password' do
    subject.password = nil
    expect(subject).to_not be_valid
  end
end
