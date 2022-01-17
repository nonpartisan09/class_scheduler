class AddPrivacyPolicyToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :privacy_policy, :boolean, default: false
  end
end
