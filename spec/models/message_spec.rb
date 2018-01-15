require 'rails_helper'

RSpec.describe Message, type: :model do
  it { is_expected.to belong_to(:conversation) }
  it { is_expected.to belong_to(:user) }

  it { is_expected.to validate_presence_of(:body) }

  it { is_expected.to have_db_column(:subject).of_type(:text) }
  it { is_expected.to have_db_column(:body).of_type(:text) }
  it { is_expected.to have_db_column(:unread).of_type(:boolean) }

  it { is_expected.to have_db_column(:conversation_id).of_type(:integer) }
  it { is_expected.to have_db_column(:user_id).of_type(:integer) }

  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
  it { is_expected.to have_db_index(:conversation_id) }
  it { is_expected.to have_db_index(:user_id) }
end
