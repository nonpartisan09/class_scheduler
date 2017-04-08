class CreateSessions < ActiveRecord::Migration[5.0]
  def change
    create_table :sessions do |t|
    	t.datetime :start, null: false
    	t.datetime :end, null: false
    	t.integer :capacity, null: false
      t.timestamps
    end
  end
end
