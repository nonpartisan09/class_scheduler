class AddHowTheyFoundUsToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :how_they_found_us, :string
  end
end
