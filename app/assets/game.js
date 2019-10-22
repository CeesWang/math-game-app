class Game {
    constructor(difficulty= 'easy', mode='time', user='guest'){
        this.difficulty = difficulty;
        this.mode = mode;
        this.user = user;
        this.problemRecord = [];
        this.score = 0;
    }

    createProblem(){
        let dif = this.difficulty;
        let newProb = new Problem(dif);
        newProb.generateProblem();
        newProb.renderProblem();
        this.problemRecord.push(newProb)
    }

    lastProblem(){
        return this.problemRecord[this.problemRecord.length -1];
    }



}