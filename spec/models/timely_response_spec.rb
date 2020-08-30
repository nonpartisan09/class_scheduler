require 'rails_helper'

RSpec.describe TimelyResponse, type: :model do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_db_column(:user_id).of_type(:integer) }
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
end
