class CreateKlasses < ActiveRecord::Migration[5.0]
  def change
    create_table :klasses do |t|
    	t.references :tutor
    	t.string :category, null: false
    	t.string :title, null: false
    	t.string :description
    	t.string :language, null: false, default: "English"
      t.timestamps
    end
  end
end
