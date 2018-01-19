class AddFeaturedToPrograms < ActiveRecord::Migration[5.1]
  def change
    add_column :programs, :featured, :boolean, :default => false
  end
end
