class CreateUserMainGoals < ActiveRecord::Migration[5.2]
  def change
    create_table :user_main_goals do |t|
      t.belongs_to :user, index: true
      t.belongs_to :main_goal, index: true

      t.timestamps
    end
  end
end
