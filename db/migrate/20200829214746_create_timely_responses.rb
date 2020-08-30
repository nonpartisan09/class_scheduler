class CreateTimelyResponses < ActiveRecord::Migration[5.2]
  def change
    create_table :timely_responses do |t|
      t.references :user, null: false
      t.references :conversation

      t.timestamps
    end
  end
end
