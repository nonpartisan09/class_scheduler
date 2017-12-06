class RemoveTimezoneFromAvailabilities < ActiveRecord::Migration[5.1]
  def change
    remove_column :availabilities, :timezone, :string
  end
end
