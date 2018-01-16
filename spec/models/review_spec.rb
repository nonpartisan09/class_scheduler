require 'rails_helper'

RSpec.describe Review, type: :model do
  it { is_expected.to belong_to(:author).class_name('User') }
  it { is_expected.to belong_to(:user).class_name('User') }

  it { is_expected.to validate_presence_of(:user_id) }
  it { is_expected.to validate_uniqueness_of(:user_id).scoped_to(:author_id) }
  it { is_expected.to validate_presence_of(:author_id) }
  it { is_expected.to validate_presence_of(:review) }

  it { is_expected.to have_db_column(:author_id).of_type(:integer) }
  it { is_expected.to have_db_column(:user_id).of_type(:integer) }
  it { is_expected.to have_db_column(:review).of_type(:integer) }
  it { is_expected.to have_db_column(:comment).of_type(:string) }

  it { is_expected.to have_db_index([:author_id, :user_id]) }

  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
end
