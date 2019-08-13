class AddSpanishFieldsToPrograms < ActiveRecord::Migration[5.2]
  def change
    add_column :programs, :spanish_name, :string, after: :name
    add_column :programs, :spanish_description, :text, after: :description
  end
end
