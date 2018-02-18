class AddEmailNotificationToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :email_notification, :boolean, default: true
  end
end
