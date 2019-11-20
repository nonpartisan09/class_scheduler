require 'rails_helper'

RSpec.describe Availability, type: :model do
  describe "Columns" do
    it { is_expected.to have_db_column(:user_id) }
    it { is_expected.to have_db_index(:user_id) }   
    it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
    it { is_expected.to have_db_column(:start_time).of_type(:datetime) }
    it { is_expected.to have_db_column(:end_time).of_type(:datetime) }
    it { is_expected.to have_db_column(:day).of_type(:string) } 
  end

  describe "Associations" do
    it { is_expected.to belong_to(:user) }
  end

  describe "Required Fields" do
    it { is_expected.to validate_presence_of(:user_id) }
    it { is_expected.to validate_presence_of(:start_time) }
    it { is_expected.to validate_presence_of(:end_time) }
    it { is_expected.to validate_presence_of(:day) }
  end

  # NOTE: overlap and other validations done through context need to be done
  # through the controller tests

end
