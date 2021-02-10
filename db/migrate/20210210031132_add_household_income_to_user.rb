class AddHouseholdIncomeToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :household_income, :string
  end
end
