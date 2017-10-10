require 'rails_helper'

RSpec.describe Role, type: :model do
  it { is_expected.to have_and_belong_to_many(:users) }

  it { is_expected.to have_db_column(:name).of_type(:string) }
  it { is_expected.to have_db_column(:displayable).of_type(:boolean) }
  it { is_expected.to have_db_column(:description).of_type(:text) }

  it { is_expected.to validate_presence_of(:url_slug) }
  it { is_expected.to validate_uniqueness_of(:url_slug) }

  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
end
