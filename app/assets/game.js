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
        let recordBox = document.createElement('div');
        recordBox.classList.add('results-box');
        recordBox.dataset.score = this.score;
        recordBox.innerHTML = `<h3> Level: ${this.difficulty} </h3><br>
        <h3> Score: ${this.score}`;
        this.problemRecord.forEach((prob) => {
            let result = prob.createProblemResult();
            recordBox.append(result);
        })
        
    }



}