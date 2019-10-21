document.addEventListener("DOMContentLoaded", ()=> {
    const problem = new Problem('medium');
    const gameBox = document.querySelector('#game-box');
    problem.generateProblem();
    problem.renderProblem();
    document.addEventListener('click', (event) =>{
      console.log(event.target);  
    })
   
    gameBox.addEventListener('click', (event) => {
        if (event.target.className == 'prim'){
           event.target.disabled = true;
        }

    })
   
   
   




   
    // const form = document.getElementById('answer-form');
    // form.addEventListener ('input',(event)=> {
    //     event.preventDefault();
    //     console.log(event.target.value);
    //     let input = event.target.value
    //     if (input.length > 0 && !isNaN(parseInt(input[input.length-1])) ) {
    //         let result = math.evaluate(event.target.value);
    //         console.log(result);
    //         document.getElementById("result").value = result;
    //     }
    //     else
    //     document.getElementById("result").value = input;

    // })
















})
