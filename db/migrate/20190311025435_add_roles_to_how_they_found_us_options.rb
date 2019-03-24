class AddRolesToHowTheyFoundUsOptions < ActiveRecord::Migration[5.2]
  def change
    add_column :how_they_found_us_options, :for_volunteer, :boolean
    add_column :how_they_found_us_options, :for_client, :boolean
  end
end
