class CreateEnglishClasses < ActiveRecord::Migration[5.1]
  def change
    create_table :english_classes do |t|
      t.date :class_date
      t.time :class_time

      t.timestamps
    end
  end
end
