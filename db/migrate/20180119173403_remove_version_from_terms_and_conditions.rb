class RemoveVersionFromTermsAndConditions < ActiveRecord::Migration[5.1]
  def change
    remove_column :terms_and_conditions, :version
  end
end
