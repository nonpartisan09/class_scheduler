class CreateFaqPages < ActiveRecord::Migration[5.2]
  def change
    create_table :faq_pages do |t|
      t.text :description
      t.text :spanish_description

      t.timestamps
    end
  end
end
