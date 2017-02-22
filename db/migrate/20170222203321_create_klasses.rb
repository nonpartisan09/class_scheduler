class CreateKlasses < ActiveRecord::Migration[5.0]
  def change
    create_table :klasses do |t|
    	t.references :tutor
    	t.string :name, null: false
    	t.string :description
      t.timestamps
    end
    add_index :klasses, :name
    rename_column :schedule, :tutor_id, :klass_id
  end
end
