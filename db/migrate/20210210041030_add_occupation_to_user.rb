class AddOccupationToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :occupation_type, :string
    add_column :users, :occupation, :string
  end
end
