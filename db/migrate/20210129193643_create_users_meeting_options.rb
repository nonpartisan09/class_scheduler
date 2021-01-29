class CreateUsersMeetingOptions < ActiveRecord::Migration[5.2]
  def change
    create_table :users_meeting_options do |t|
      t.belongs_to :user, index: true
      t.belongs_to :meeting_option, index: true

      t.timestamps
    end
  end
end
