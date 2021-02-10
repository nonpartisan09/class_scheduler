require 'rails_helper'

RSpec.describe UserMainGoal, type: :model do
  it { is_expected.to belong_to(:user) }
  it { is_expected.to belong_to(:main_goal) }

  it { is_expected.to have_db_column(:user_id).of_type(:integer) }
  it { is_expected.to have_db_column(:main_goal_id).of_type(:integer) }
  it { is_expected.to have_db_index(:user_id) }
  it { is_expected.to have_db_index(:main_goal_id) }

  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
end
