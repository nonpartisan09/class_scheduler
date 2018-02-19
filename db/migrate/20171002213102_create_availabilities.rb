class CreateAvailabilities < ActiveRecord::Migration[5.1]
  def change
    create_table :availabilities do |t|
      t.string :day
      t.datetime :start_time
      t.datetime :end_time
      t.timestamps

      t.belongs_to :user, index: true
    end
  end
end
