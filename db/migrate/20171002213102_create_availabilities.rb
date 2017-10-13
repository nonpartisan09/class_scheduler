class CreateAvailabilities < ActiveRecord::Migration[5.1]
  def change
    create_table :availabilities do |t|
      t.string :day
      t.boolean :vacation
      t.time :start_time
      t.time :end_time
      t.string :timezone, default: "UTC"
      t.timestamps

      t.belongs_to :users, index: true
    end
  end
end
