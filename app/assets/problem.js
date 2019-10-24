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
        this.solved = false;
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
            this.solution += ' ';
            this.solution += this.opsArray[Math.floor(Math.random() * (4))];
            this.solution += ' ';
        })

        this.solution = this.solution.slice(0, -2);
        if (!this.validate()) {
            this.generateProblem();
        }

    }

    validate(){
        return math.evaluate(this.solution) % 1 == 0
    }

    target(){
        return math.evaluate(this.solution)
    }

    renderProblem(){
        const target = document.querySelector('#target');
        const primitives = document.querySelector('#primitives');
        primitives.innerHTML = "";

        target.innerText = `Target: ${this.target()}`;

        let idCounter = 1;
        this.primArray.forEach((prim) => {
            let button = document.createElement('button');
            button.classList.add('prim');
            button.id = `prim-${idCounter}`;
            button.dataset.used = false;
            idCounter++;
            button.innerText = prim;
            primitives.append(button);
        })

        

        // this.opsArray.forEach((operator) => {
        //     let button = document.createElement('button');
        //     button.classList.add('operator');
        //     button.innerText = operator;
        //     operations.append(button);
        //     button.disabled = true;
        // })

        // let openButton = document.createElement('button');
        // openButton.classList.add('paren');
        // openButton.innerText = '(';
        // openButton.id = 'open';
        // operations.append(openButton);
            
        // let closeButton = document.createElement('button');
        // closeButton.classList.add('paren');
        // closeButton.innerText = ')';
        // closeButton.id = 'close';
        // closeButton.disabled = true;
        // operations.append(closeButton);
            
    }

    createProblemResult(){
        let wrongIcon = document.createElement("i");
        wrongIcon.classList.add('fas', 'fa-times', 'fa-2x'); 
        wrongIcon.style.color = "red"; 
        let rightIcon = document.createElement("i");
        rightIcon.classList.add('fas', 'fa-check','fa-2x');


        let p = document.createElement('p');
        p.classList.add('problem-result');

        p.innerText = `${this.userAnswer} = ${this.userAnswerValue}`;

        if (this.solved){
            p.append(rightIcon);
        } else {
            p.innerText += ` SOLUTION: ${this.solution} = ${this.target()}`
            p.append(wrongIcon)
        }
        return p;
    }

    

}