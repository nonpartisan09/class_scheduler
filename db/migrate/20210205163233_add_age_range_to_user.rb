class AddAgeRangeToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :age_range, :string
  end
end
