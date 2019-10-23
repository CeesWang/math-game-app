# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_10_23_155540) do

  create_table "games", force: :cascade do |t|
    t.string "user"
    t.string "difficulty"
    t.integer "score"
    t.integer "problem_count"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "problems", force: :cascade do |t|
    t.integer "target"
    t.string "solution"
    t.string "user_answer"
    t.boolean "solved"
    t.integer "game_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.float "user_answer_value"
    t.index ["game_id"], name: "index_problems_on_game_id"
  end

  add_foreign_key "problems", "games"
end
