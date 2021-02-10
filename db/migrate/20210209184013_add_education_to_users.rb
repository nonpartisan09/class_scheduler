class AddEducationToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :education, :string
  end
end
