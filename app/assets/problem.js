class Problem {
    constructor(numPrimitives, difficulty){
        this.numPrimitives = numPrimitives;
        this.difficulty = difficulty;
        this.opsArray = ['+', '-', '*', '/'];
    }

    generatePrimitives(min, max){
       this.primArray = [];

        for (let i = 0; i < this.numPrimitives; i++){
            let newPrim = Math.floor(Math.random() * (max - min) + min);
            this.primArray.push(newPrim);           
        }
    }

    generateProblem(min = 1, max = 11){
        this.generatePrimitives(min, max);
        
        let usedOps = [];

        this.solution = '';

        this.primArray.forEach((prim) => {
            this.solution += prim;
            this.solution += this.opsArray[Math.floor(Math.random() * (4))]
        })

        this.solution = this.solution.slice(0, -1);
    }

    

}