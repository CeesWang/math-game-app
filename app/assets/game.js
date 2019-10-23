class Game {
    constructor(difficulty= 'easy', mode='time', user='guest'){
        this.difficulty = difficulty;
        this.mode = mode;
        this.user = user;
        this.problemRecord = [];
        this.score = 0;
        this.solved = false;
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

    displayGameResults(){
        let scoreDisplay = document.querySelector('#results-score');
        let difficultyDisplay = document.querySelector('#results-difficulty');

        scoreDisplay.innerText = `Score: ${this.score}/${this.problemRecord.length}`;
        difficultyDisplay.innerText = `Difficulty: ${this.difficulty}`;


        let recordBox = document.querySelector('#record-box');
        this.problemRecord.forEach((prob) => {
            let result = prob.createProblemResult();
            recordBox.append(result);
        })
        
    }



}