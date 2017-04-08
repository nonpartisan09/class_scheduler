class CreateBookings < ActiveRecord::Migration[5.0]
  def change
    create_table :bookings do |t|
    	t.references :user
    	t.references :session
    	t.string :status, null: false, default: "pending"
      t.timestamps
    end
  end
end
