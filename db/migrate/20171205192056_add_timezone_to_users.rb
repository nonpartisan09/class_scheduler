class AddTimezoneToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :timezone, :string, :default => "UTC"
  end

  def up
    User.find_each do |user|
      user.update!(
          timezone: 'UTC'
      )
    end
  end
end
