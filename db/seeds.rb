# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Game.destroy_all
Problem.destroy_all

g1 = Game.create(user: 'jack', difficulty: 'easy', score: 2, problem_count: 3)

p1 = Problem.create(target: 3, solution: '1+1+1', user_answer: '1+1+1', solved: true, game_id: 1, user_answer_value: 3)
p2 = Problem.create(target: 5, solution: '1+2*2', user_answer: '(2+1)+2', solved: true, game_id: 1, user_answer_value: 5)
p3 = Problem.create(target: 8, solution: '2*4/1', user_answer: '2*4+1', solved: false, game_id: 1, user_answer_value: 9)