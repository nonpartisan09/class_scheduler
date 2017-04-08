class CreateMessages < ActiveRecord::Migration[5.0]
  def change
    create_table :messages do |t|
    	t.integer :sender_id, null: false
    	t.integer :receiver_id, null: false
    	t.text :body, null: false, limit: 500
      t.timestamps
    end
  end
end
