class AddPrivacyPolicy < ActiveRecord::Migration[5.2]
  def change
    create_table :privacy_policy do |t|
      t.text :description, null: false
      t.text :spanish_description, null: false
      t.timestamps
    end
  end
end
