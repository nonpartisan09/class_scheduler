class AddUserInfo < ActiveRecord::Migration[5.0]
  def change
  	add_column :users, :first_name, :string, null: false
  	add_column :users, :last_name, :string, null: false
  	add_column :users, :language, :string, null: false, default: "en"
  	add_column :users, :about, :string, null: false
	end
end