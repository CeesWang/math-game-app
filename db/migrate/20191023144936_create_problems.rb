class CreateProblems < ActiveRecord::Migration[6.0]
  def change
    create_table :problems do |t|
      t.integer :target
      t.string :solution
      t.string :user_answer
      t.boolean :solved
      t.references :game, null: false, foreign_key: true

      t.timestamps
    end
  end
end
