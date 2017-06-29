class AddTypeToUser < ActiveRecord::Migration[5.1]
  def self.up
    add_column :users, :type, :string
  end
  
  def down
    remove_column :users, :type, :string
  end
end
