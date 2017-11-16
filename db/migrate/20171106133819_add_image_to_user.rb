class AddImageToUser < ActiveRecord::Migration[5.1]
  def change
    add_attachment :users, :thumbnail_image
  end
end
