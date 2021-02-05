require 'rails_helper'

RSpec.describe UsersEthnicityRace, type: :model do
  it { is_expected.to belong_to(:user) }
  it { is_expected.to belong_to(:ethnicity_race) }

  it { is_expected.to have_db_column(:user_id).of_type(:integer) }
  it { is_expected.to have_db_column(:ethnicity_race_id).of_type(:integer) }
  it { is_expected.to have_db_index(:user_id) }
  it { is_expected.to have_db_index(:ethnicity_race_id) }

  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
end
