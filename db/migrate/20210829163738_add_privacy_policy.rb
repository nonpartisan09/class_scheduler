class AddPrivacyPolicy < ActiveRecord::Migration[5.2]
  def change
    create_table :privacy_policy do |t|
      t.text :description
      t.text :spanish_description
      t.timestamps
    end
  end
end
