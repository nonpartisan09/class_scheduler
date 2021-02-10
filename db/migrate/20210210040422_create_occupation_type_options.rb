class CreateOccupationTypeOptions < ActiveRecord::Migration[5.2]
  def change
    create_table :occupation_type_options do |t|
      t.string :name
      t.string :spanish_name

      t.timestamps
    end
  end
end
