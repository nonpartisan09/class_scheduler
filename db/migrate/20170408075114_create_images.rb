class CreateImages < ActiveRecord::Migration[5.0]
  def change
    create_table :images do |t|
    	t.references :owner, polymorphic: true
    	t.string :public_id, null: false
      t.timestamps
    end
  end
end
