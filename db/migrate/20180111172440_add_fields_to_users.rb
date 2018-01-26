class AddFieldsToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :average_rating, :integer, default: 0
    add_column :users, :rating_count, :integer, default: 0
    add_column :users, :state, :string
    add_column :users, :country, :string
  end
end
