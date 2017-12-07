class UpdateUrlSlugColumn < ActiveRecord::Migration[5.1]
  def up
    User.find_each do |user|
      user.regenerate_url_slug!(force: true)
    end
  end
end
