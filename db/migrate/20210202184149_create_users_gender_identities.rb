class CreateUsersGenderIdentities < ActiveRecord::Migration[5.2]
  def change
    create_table :users_gender_identities do |t|
      t.belongs_to :user, index: true
      t.belongs_to :gender_identity, index: true

      t.timestamps
    end
  end
end
