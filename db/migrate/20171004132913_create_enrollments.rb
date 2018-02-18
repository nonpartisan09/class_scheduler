class CreateEnrollments < ActiveRecord::Migration[5.1]
  def change
    create_table :enrollments do |t|
      t.belongs_to :user, index: true
      t.belongs_to :program, index: true
      t.timestamps
    end
  end
end
