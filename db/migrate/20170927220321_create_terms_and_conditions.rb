class CreateTermsAndConditions < ActiveRecord::Migration[5.1]
  def change
    create_table :terms_and_conditions do |t|
      t.text :description

      t.timestamps
    end
  end
end
