class CreateAboutPage < ActiveRecord::Migration[5.1]
  def change
    create_table :about_pages do |t|
      t.text :description

      t.timestamps
    end
  end
end
