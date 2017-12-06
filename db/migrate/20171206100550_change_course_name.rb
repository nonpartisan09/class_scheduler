class ChangeCourseName < ActiveRecord::Migration[5.1]
  def change
    rename_column :enrollments, :course_id, :program_id
  end
end
