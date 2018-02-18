class AddActivePasswordToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :active, :boolean, default: true
    add_column :users, :generated_password, :boolean, default: false
  end
end
