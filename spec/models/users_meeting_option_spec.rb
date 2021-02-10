require 'rails_helper'

RSpec.describe UsersMeetingOption, type: :model do
  it { is_expected.to belong_to(:user) }
  it { is_expected.to belong_to(:meeting_option) }

  it { is_expected.to have_db_column(:user_id).of_type(:integer) }
  it { is_expected.to have_db_column(:meeting_option_id).of_type(:integer) }
  it { is_expected.to have_db_index(:user_id) }
  it { is_expected.to have_db_index(:meeting_option_id) }

  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
end
