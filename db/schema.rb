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

ActiveRecord::Schema.define(version: 2019_08_18_064232) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "about_pages", force: :cascade do |t|
    t.text "description"
    t.text "spanish_description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

  create_table "availabilities", force: :cascade do |t|
    t.string "day"
    t.datetime "start_time"
    t.datetime "end_time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["user_id"], name: "index_availabilities_on_user_id"
  end

  create_table "conversations", force: :cascade do |t|
    t.integer "author_id"
    t.integer "recipient_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_id", "recipient_id"], name: "index_conversations_on_author_id_and_recipient_id", unique: true
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer "priority", default: 0, null: false
    t.integer "attempts", default: 0, null: false
    t.text "handler", null: false
    t.text "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by"
    t.string "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

  create_table "enrollments", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "program_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["program_id"], name: "index_enrollments_on_program_id"
    t.index ["user_id"], name: "index_enrollments_on_user_id"
  end

  create_table "faq_pages", force: :cascade do |t|
    t.text "description"
    t.text "spanish_description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "how_they_found_us_options", force: :cascade do |t|
    t.text "name"
    t.text "spanish_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "for_volunteer"
    t.boolean "for_client"
  end

  create_table "languages", force: :cascade do |t|
    t.string "name"
    t.string "url_slug"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "languages_users", id: false, force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "language_id", null: false
    t.index ["language_id", "user_id"], name: "index_languages_users_on_language_id_and_user_id"
    t.index ["user_id", "language_id"], name: "index_languages_users_on_user_id_and_language_id"
  end

  create_table "messages", force: :cascade do |t|
    t.text "body"
    t.text "subject"
    t.boolean "unread", default: true
    t.bigint "conversation_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["conversation_id"], name: "index_messages_on_conversation_id"
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "programs", force: :cascade do |t|
    t.string "name"
    t.string "url_slug"
    t.text "description"
    t.boolean "featured", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "spanish_name"
    t.text "spanish_description"
  end

  create_table "reviews", force: :cascade do |t|
    t.integer "author_id"
    t.integer "user_id"
    t.integer "review"
    t.string "comment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_id", "user_id"], name: "index_reviews_on_author_id_and_user_id", unique: true
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.string "url_slug"
    t.boolean "displayable", default: true
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "roles_users", id: false, force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_roles_users_on_role_id"
    t.index ["user_id"], name: "index_roles_users_on_user_id"
  end

  create_table "terms_and_conditions", force: :cascade do |t|
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "url_slug", default: "", null: false
    t.integer "terms_and_conditions"
    t.boolean "contact_permission"
    t.string "address"
    t.string "city"
    t.float "latitude"
    t.float "longitude"
    t.text "description"
    t.string "timezone", default: "UTC"
    t.integer "average_rating", default: 0
    t.integer "rating_count", default: 0
    t.string "state"
    t.string "country"
    t.boolean "active", default: true
    t.boolean "generated_password", default: false
    t.string "locale", default: "en"
    t.boolean "email_notification", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "thumbnail_image_file_name"
    t.string "thumbnail_image_content_type"
    t.integer "thumbnail_image_file_size"
    t.datetime "thumbnail_image_updated_at"
    t.string "phone_number"
    t.string "how_they_found_us"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "messages", "conversations"
  add_foreign_key "messages", "users"
end
