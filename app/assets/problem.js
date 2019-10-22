class Problem {
    constructor(difficulty){
        switch (difficulty){
            case 'easy': this.numPrimitives = 3;
            break;
            case 'medium': this.numPrimitives = 4;
            break;
            case 'hard': this.numPrimitives = 5;
            break;
            default: this.numPrimitives = 3;

        }


        this.difficulty = difficulty;
        this.opsArray = ['+', '-', '*', '/'];
        this.problemStack = []; 
    }

    generatePrimitives(min, max){
       this.primArray = [];

        for (let i = 0; i < this.numPrimitives; i++){
            let newPrim = Math.floor(Math.random() * (max - min) + min);
            this.primArray.push(newPrim);           
        }

        this.primArray.sort((a,b) => a-b);
    }

    generateProblem(min = 1, max = 10){
        this.generatePrimitives(min, max);

        this.solution = '';

        this.primArray.forEach((prim) => {
            this.solution += prim;
            this.solution += this.opsArray[Math.floor(Math.random() * (4))]
        })

        this.solution = this.solution.slice(0, -1);
        if (!this.validate()) {
            this.generateProblem();
        }

    }

    validate(){
        return math.evaluate(this.solution) % 1 == 0
    }

    finalAnswer(){
        return math.evaluate(this.solution)
    }

    renderProblem(){
        const target = document.querySelector('#target');
        const primitives = document.querySelector('#primitives');
        const operations = document.querySelector('#operations');

        target.innerText = `Target: ${this.finalAnswer()}`;
        
        let idCounter = 1;
        this.primArray.forEach((prim) => {
            let button = document.createElement('button');
            button.classList.add('prim');
            button.id = `prim-${idCounter}`;
            button.dataset.used = false;
            idCounter ++;
            button.innerText = prim;
            primitives.append(button);
        })

        this.opsArray.forEach((operator) => {
            let button = document.createElement('button');
            button.classList.add('operator');
            button.innerText = operator;
            operations.append(button);
            button.disabled = true;
        })

        let openButton = document.createElement('button');
        openButton.classList.add('paren');
        openButton.innerText = '(';
        openButton.id = 'open';
        operations.append(openButton);
            
        let closeButton = document.createElement('button');
        closeButton.classList.add('paren');
        closeButton.innerText = ')';
        closeButton.id = 'close';
        closeButton.disabled = true;
        operations.append(closeButton);
            
    }

    

}