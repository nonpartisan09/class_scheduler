require 'rails_helper'

RSpec.describe Language, type: :model do

  it { should validate_uniqueness_of(:url_slug) }
  it { is_expected.to have_and_belong_to_many(:users) }

  it { is_expected.to have_db_column(:name).of_type(:string) }
  it { is_expected.to have_db_column(:url_slug).of_type(:string) }
  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
end
