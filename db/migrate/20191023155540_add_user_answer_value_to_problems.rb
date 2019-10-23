class AddUserAnswerValueToProblems < ActiveRecord::Migration[6.0]
  def change
    add_column :problems, :user_answer_value, :float
  end
end
