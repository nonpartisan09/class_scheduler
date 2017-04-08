class CreateCourses < ActiveRecord::Migration[5.0]
  def change
    create_table :courses do |t|
    	t.references :volunteer
    	t.string :category, null: false
    	t.string :title, null: false
    	t.string :description, null: false
    	t.string :language, null: false, default: "en"
      t.timestamps
    end
  end
end