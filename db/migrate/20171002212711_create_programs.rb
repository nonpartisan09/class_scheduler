class CreatePrograms < ActiveRecord::Migration[5.1]
  def change
    create_table :programs do |t|
      t.string :name
      t.string :spanish_name
      t.string :url_slug
      t.text :description
      t.text :spanish_description
      t.boolean :featured, :default => false

      t.timestamps
    end
  end
end
