require 'rails_helper'

RSpec.describe Conversation, type: :model do

  it { is_expected.to belong_to(:author).class_name('User') }
  it { is_expected.to belong_to(:recipient).class_name('User') }

  it { is_expected.to validate_presence_of(:author_id) }
  it { is_expected.to validate_uniqueness_of(:author_id).scoped_to(:recipient_id) }

  it { is_expected.to have_many(:messages).dependent(:destroy) }

  it { is_expected.to have_db_column(:author_id).of_type(:integer) }
  it { is_expected.to have_db_column(:recipient_id).of_type(:integer) }
  it { is_expected.to have_db_index([:author_id, :recipient_id]) }

  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
end
