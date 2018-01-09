class CreateReviews < ActiveRecord::Migration[5.1]
  def change
    create_table :reviews do |t|
      t.integer :author_id
      t.integer :user_id
      t.integer :review

      t.timestamps
    end
    add_index :reviews, [:author_id, :user_id], unique: true
  end
end
