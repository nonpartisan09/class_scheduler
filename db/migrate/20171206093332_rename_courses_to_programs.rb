class RenameCoursesToPrograms < ActiveRecord::Migration[5.1]
  def change
    rename_table :courses, :programs
  end
end
