class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.string :user
      t.string :difficulty
      t.integer :score
      t.integer :problem_count

      t.timestamps
    end
  end
end
