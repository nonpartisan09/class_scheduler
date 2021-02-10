class CreateAgeRangeOptions < ActiveRecord::Migration[5.2]
  def change
    create_table :age_range_options do |t|
      t.string :name
      t.string :spanish_name

      t.timestamps
    end
  end
end
