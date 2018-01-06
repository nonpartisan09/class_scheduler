require 'rails_helper'

RSpec.describe Program, type: :model do
  it { is_expected.to have_many(:users).through(:enrollments) }
  it { is_expected.to have_many(:enrollments) }

  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:url_slug) }
  it { is_expected.to validate_uniqueness_of(:url_slug) }

  it { is_expected.to have_db_column(:name).of_type(:string) }
  it { is_expected.to have_db_column(:url_slug).of_type(:string) }
  it { is_expected.to have_db_column(:description).of_type(:text) }

  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
end
