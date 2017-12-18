class CreateConversations < ActiveRecord::Migration[5.1]
  def change
    create_table :conversations do |t|
      t.integer :author_id
      t.integer :recipient_id

      t.timestamps
    end

    add_index :conversations, [:author_id, :recipient_id], unique: true
  end
end
