class AddTimeoutUserCol < ActiveRecord::Migration[5.2]
  def change
    add_column  :users, :timeout, :boolean, default: false
  end
end
