require 'rails_helper'

RSpec.describe TermsAndConditions, type: :model do
  it { is_expected.to have_db_column(:version).of_type(:integer) }
  it { is_expected.to have_db_column(:description).of_type(:text) }

  it { is_expected.to validate_uniqueness_of(:version) }
  it { is_expected.to validate_presence_of(:version) }

  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
end
