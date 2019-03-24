class CreateHowTheyFoundUsOptions < ActiveRecord::Migration[5.2]
  def change
    create_table :how_they_found_us_options do |t|
      t.text :name
      t.text :spanish_name

      t.timestamps
    end
  end
end
