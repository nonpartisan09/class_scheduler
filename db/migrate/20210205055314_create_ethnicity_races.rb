class CreateEthnicityRaces < ActiveRecord::Migration[5.2]
  def change
    create_table :ethnicity_races do |t|
      t.string :name
      t.string :spanish_name
      t.boolean :displayable

      t.timestamps
    end
  end
end
