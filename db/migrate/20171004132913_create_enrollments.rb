class CreateEnrollments < ActiveRecord::Migration[5.1]
  def change
    create_table :enrollments do |t|
      t.belongs_to :users, index: true
      t.belongs_to :course, index: true
      t.timestamps
    end
  end
end
