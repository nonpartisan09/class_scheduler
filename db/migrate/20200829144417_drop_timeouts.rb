class DropTimeouts < ActiveRecord::Migration[5.2]
  def change
    drop_table :timeouts
  end
end
