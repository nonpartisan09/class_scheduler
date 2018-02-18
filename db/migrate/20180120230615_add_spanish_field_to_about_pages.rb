class AddSpanishFieldToAboutPages < ActiveRecord::Migration[5.1]
  def change
    add_column :about_pages, :spanish_description, :text
  end
end
