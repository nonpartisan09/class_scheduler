class CreateRoles < ActiveRecord::Migration[5.1]
  def change
    create_table :roles do |t|
      t.string :name
      t.string :url_slug
      t.boolean :displayable
      t.text :description

      t.timestamps
    end

    create_table :roles_users, id: false do |t|
      t.belongs_to :users, index: true
      t.belongs_to :role, index: true
    end
  end
end
