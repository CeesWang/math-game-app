class GamesController < ApplicationController

    def index
       games = Game.all

       render json: games
    end

    def show
        game = Game.all.find(params[:id])
        problems = Problem.find_by(game_id: params[:id]);
        render json: game
    end 

    def create
        newGame = Game.create(game_params)

        render json: newGame
    end

    private

    def game_params
        params.permit(:user, :difficulty, :score, :problem_count)
    end
end
