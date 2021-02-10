class AddAgeVerificationAndBackgroundCheckConsentToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :is_over_18, :boolean
    add_column :users, :consented_to_background_check, :boolean, default: false
  end
end
