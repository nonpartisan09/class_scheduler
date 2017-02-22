# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170222205901) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "klasses", force: :cascade do |t|
    t.integer  "tutor_id"
    t.string   "type",        null: false
    t.string   "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "title",       null: false
    t.index ["tutor_id"], name: "index_klasses_on_tutor_id", using: :btree
    t.index ["type"], name: "index_klasses_on_type", using: :btree
  end

  create_table "schedules", force: :cascade do |t|
    t.integer  "klass_id"
    t.boolean  "sun_mor",    default: false, null: false
    t.boolean  "sun_aft",    default: false, null: false
    t.boolean  "sun_eve",    default: false, null: false
    t.boolean  "mon_mor",    default: false, null: false
    t.boolean  "mon_aft",    default: false, null: false
    t.boolean  "mon_eve",    default: false, null: false
    t.boolean  "tue_mor",    default: false, null: false
    t.boolean  "tue_aft",    default: false, null: false
    t.boolean  "tue_eve",    default: false, null: false
    t.boolean  "wed_mor",    default: false, null: false
    t.boolean  "wed_aft",    default: false, null: false
    t.boolean  "wed_eve",    default: false, null: false
    t.boolean  "thu_mor",    default: false, null: false
    t.boolean  "thu_aft",    default: false, null: false
    t.boolean  "thu_eve",    default: false, null: false
    t.boolean  "fri_mor",    default: false, null: false
    t.boolean  "fri_aft",    default: false, null: false
    t.boolean  "fri_eve",    default: false, null: false
    t.boolean  "sat_mor",    default: false, null: false
    t.boolean  "sat_aft",    default: false, null: false
    t.boolean  "sat_eve",    default: false, null: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.index ["klass_id"], name: "index_schedules_on_klass_id", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "",        null: false
    t.string   "encrypted_password",     default: "",        null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,         null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                                 null: false
    t.datetime "updated_at",                                 null: false
    t.string   "phone_number"
    t.string   "f_name",                                     null: false
    t.string   "l_name",                                     null: false
    t.string   "profile_src"
    t.string   "type",                   default: "Student", null: false
    t.string   "language",               default: "English", null: false
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["f_name"], name: "index_users_on_f_name", using: :btree
    t.index ["l_name"], name: "index_users_on_l_name", using: :btree
    t.index ["phone_number"], name: "index_users_on_phone_number", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  end

end
