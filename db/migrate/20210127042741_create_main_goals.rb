class CreateMainGoals < ActiveRecord::Migration[5.2]
  def change
    create_table :main_goals do |t|
      t.string :name
      t.string :spanish_name
      t.boolean :for_volunteer
      t.boolean :for_client
      t.boolean :displayable, default: false

      t.timestamps
    end
  end
end
