class RemoveLanguageColumnFromKlasses < ActiveRecord::Migration[5.0]
  def change
  	remove_column :klasses, :language
  end
end
