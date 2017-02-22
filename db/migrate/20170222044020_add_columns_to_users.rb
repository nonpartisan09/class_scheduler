class AddColumnsToUsers < ActiveRecord::Migration[5.0]
  def change
  	add_column :users, :phone_number, :string
  	add_column :users, :f_name, :string, null: false
  	add_column :users, :l_name, :string, null: false
  	add_column :users, :type, :string, 
  		null: false, default: "Student"
  	add_column :users, :language, :string, 
  		null: false, default: "English"

  	add_index :users, :f_name
  	add_index :users, :l_name
  	add_index :users, :phone_number, unique: true
  end
end
