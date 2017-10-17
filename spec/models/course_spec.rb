require 'rails_helper'

RSpec.describe Course, type: :model do
  it { is_expected.to have_many(:users).through(:enrollments) }

  it { is_expected.to have_db_column(:name).of_type(:string) }
  it { is_expected.to have_db_column(:url_slug).of_type(:string) }
  it { is_expected.to have_db_column(:description).of_type(:text) }

  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
end
