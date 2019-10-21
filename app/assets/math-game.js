document.addEventListener("DOMContentLoaded", ()=> {
    const problem = new Problem('medium');
    const gameBox = document.querySelector('#game-box');
    const answerDisplay = document.querySelector('#answer-display');
    let openParens = 0;
 
    const submitButton = document.querySelector('#submit');

    problem.generateProblem();
    problem.renderProblem();
    let open = document.querySelector('#open');
    let close = document.querySelector('#close');
    document.addEventListener('click', (event) =>{
      console.log(event.target);  
    })
   
    gameBox.addEventListener('click', (event) => {

        if (event.target.className === 'prim'){
           event.target.dataset.used = 'true';
           disableAllPrims();
           enableAllOps();
           checkForSubmit()
           answerDisplay.innerText += event.target.innerText;
        }

        if (event.target.className === 'operator'){
            answerDisplay.innerText += event.target.innerText;
            enableUnusedPrims();
            disableAllOps();
         }

        if (event.target.id === 'clear'){
            answerDisplay.innerText = '';
            let prims = document.querySelectorAll('.prim');
            open.disabled = false;
            openParens = 0;
            prims.forEach((prim) => {
                prim.disabled = false
                prim.dataset.used = 'false';
                });
            checkForSubmit()
        }

        if (event.target.id === 'open'){
            answerDisplay.innerText += event.target.innerText;
            openParens++;
            enableUnusedPrims();
            disableAllOps();
            enableCloseParen();
        }

        if (event.target.id === 'close'){            
            openParens--;
            answerDisplay.innerText += event.target.innerText;
            checkForSubmit()
            if (openParens < 1){
                disableCloseParen()
            }
        }


        if (event.target.id == 'submit'){
            if (math.evaluate(answerDisplay.innerText) == problem.finalAnswer()){
                alert('Correct!')
            } else {
                alert('WROOOOOOONG')
            }
        }
        
    }) // end of gamebox eventListener
    

    function enableUnusedPrims(){
        let prims = document.querySelectorAll('.prim');
        // console.log(prims)
        prims.forEach((prim) => {
            // debugger
           if (prim.dataset.used == 'false'){
                console.log(prim, prim.dataset.used)
                prim.disabled = false;
            }
            
        })
    }

    function disableAllPrims(){
        let prims = document.querySelectorAll('.prim');

        prims.forEach((prim) => {
                prim.disabled = true
        })
    }

    function disableAllOps(){
        let ops = document.querySelectorAll('.operator');

        ops.forEach(op => {
            op.disabled = true;
        })
    }

    function enableAllOps(){
        let ops = document.querySelectorAll('.operator');

        ops.forEach(op => {
            op.disabled = false;
        })
    }

    function enableCloseParen(){
        close.disabled = false;
    }

    function disableCloseParen(){
        close.disabled = true;
    }
   
    function checkForSubmit(){
        let prims = Array.from(document.querySelectorAll('.prim'));

        if(prims.every(prim => prim.dataset.used == 'true') && openParens == 0){
            submitButton.disabled = false;           
            open.disabled = true;
            disableAllPrims();
            disableAllOps();
        } else {
            submitButton.disabled = true;
        }
    }
   




   
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
