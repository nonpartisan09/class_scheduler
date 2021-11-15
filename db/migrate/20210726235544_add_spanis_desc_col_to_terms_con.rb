class AddSpanisDescColToTermsCon < ActiveRecord::Migration[5.2]
  def change
    add_column :terms_and_conditions, :spanish_description, :text
  end
end
