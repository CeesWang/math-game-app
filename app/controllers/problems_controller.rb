class ProblemsController < ApplicationController

    def index
        problems = Problem.all

        render json: problems
    end

    def show
        problem = Problem.find_by(id: params[:id]);
        render json: problem
    end
    


end
