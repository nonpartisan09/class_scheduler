class CreateCourses < ActiveRecord::Migration[5.1]
  def change
    create_table :courses do |t|
      t.string :name
      t.string :url_slug
      t.text :description

      t.timestamps
    end
  end
end
