class AddDeactiveColumnToUser < ActiveRecord::Migration[5.2]
  def change
    add_column  :users, :unresponsive, :boolean, default: false
    add_column :conversations, :timely, :boolean, default: true
  end
end
