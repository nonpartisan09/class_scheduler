class CreateTimeables < ActiveRecord::Migration[5.1]
  def change
    create_table :timeables do |t|
      t.belongs_to :users, index: true
      t.belongs_to :availability, index: true
      t.timestamps
    end
  end
end
