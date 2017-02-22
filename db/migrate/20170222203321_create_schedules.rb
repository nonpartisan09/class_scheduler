class CreateSchedules < ActiveRecord::Migration[5.0]
  def change
    create_table :schedules do |t|
    	t.references :klass
    	t.boolean :sun_mor, null: false, default: false
    	t.boolean :sun_aft, null: false, default: false
    	t.boolean :sun_eve, null: false, default: false
    	t.boolean :mon_mor, null: false, default: false
    	t.boolean :mon_aft, null: false, default: false
    	t.boolean :mon_eve, null: false, default: false
    	t.boolean :tue_mor, null: false, default: false
    	t.boolean :tue_aft, null: false, default: false
    	t.boolean :tue_eve, null: false, default: false
    	t.boolean :wed_mor, null: false, default: false
    	t.boolean :wed_aft, null: false, default: false
    	t.boolean :wed_eve, null: false, default: false
    	t.boolean :thu_mor, null: false, default: false
    	t.boolean :thu_aft, null: false, default: false
    	t.boolean :thu_eve, null: false, default: false
    	t.boolean :fri_mor, null: false, default: false
    	t.boolean :fri_aft, null: false, default: false
    	t.boolean :fri_eve, null: false, default: false
    	t.boolean :sat_mor, null: false, default: false
    	t.boolean :sat_aft, null: false, default: false
    	t.boolean :sat_eve, null: false, default: false
      t.timestamps
    end
  end
end
