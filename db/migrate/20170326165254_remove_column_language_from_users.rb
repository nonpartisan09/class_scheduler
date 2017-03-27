class RemoveColumnLanguageFromUsers < ActiveRecord::Migration[5.0]
  def change
  	remove_column :users, :language
  end
end
