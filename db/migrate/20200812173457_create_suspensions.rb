class CreateSuspensions < ActiveRecord::Migration[5.2]
  def change
    create_table :suspensions do |t|
      t.integer :user_id, null: false
      t.timestamps
    end

    add_index :suspensions, :user_id
  end
end
