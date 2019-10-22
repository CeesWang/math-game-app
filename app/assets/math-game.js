

document.addEventListener("DOMContentLoaded", ()=> {
    const problem = new Problem('medium');
    const gameBox = document.querySelector('#game-box');

    const answerDisplay = document.querySelector('#answer-display');
    const undo = document.querySelector('#undo');
    const submitButton = document.querySelector('#submit');
    let openParens = 0;
    let actionStack = [];

    let newGameButton = document.querySelector('#new-game');
    newGameButton.addEventListener('click', e => {
        gameBox.style.display = 'block';
    })


    //startTimer();

    problem.generateProblem();
    problem.renderProblem();
    //gameBox.style.display = 'none';
    let open = document.querySelector('#open');
    let close = document.querySelector('#close');
   
    gameBox.addEventListener('click', (event) => {
        if ((event.target.tagName == "BUTTON" && !(event.target.id == 'undo')) && !(event.target.id === 'clear')){
            actionStack.push(event.target);
        }

        if (event.target.className === 'prim'){
           event.target.dataset.used = 'true';
           disableAllPrims();
           enableAllOps();
           checkForSubmit();
           enableCloseParenIfOpenParens();
           answerDisplay.innerText = convertActionStackToString();
        }

        if (event.target.className === 'operator'){
            answerDisplay.innerText = convertActionStackToString();
            enableUnusedPrims();
            disableAllOps();
        }
        if (event.target.id == 'undo'){
            let lastAction = actionStack.pop();

            answerDisplay.innerText = convertActionStackToString();

            if(lastAction.className == 'prim'){
                lastAction.dataset.used = 'false';
                enableUnusedPrims();
                disableAllOps();
            } else if (lastAction.className == 'operator'){
                disableAllPrims();
                enableAllOps();
                checkForSubmit();
            } else if (lastAction.id == 'open'){
                openParens--;
                enableCloseParenIfOpenParens();
            } else if (lastAction.id == 'close'){
                openParens++;
                enableCloseParenIfOpenParens();
            }

            if(actionStack.length == 0){
                answerDisplay.innerText = '';
                let prims = document.querySelectorAll('.prim');
                open.disabled = false;
                openParens = 0;
                actionStack = [];
                prims.forEach((prim) => {
                prim.disabled = false
                prim.dataset.used = 'false';
            })
                checkForSubmit()
            } else if (actionStack[actionStack.length - 1].className == 'prim'){
                disableAllPrims();
                enableAllOps();
                enableCloseParenIfOpenParens();
                checkForSubmit();
             } else if (actionStack[actionStack.length - 1].className == 'operator'){
                enableUnusedPrims();
                disableAllOps();
            } else if (actionStack[actionStack.length - 1].id == 'open'){
                enableUnusedPrims();
                disableAllOps();
                disableCloseParen();
            } else if (actionStack[actionStack.length - 1].id == 'close'){
                checkForSubmit()
                enableCloseParenIfOpenParens();
            }
         }

        if (event.target.id === 'clear'){
            answerDisplay.innerText = '';
            let prims = document.querySelectorAll('.prim');
            open.disabled = false;
            openParens = 0;
            actionStack = [];
            prims.forEach((prim) => {
                prim.disabled = false
                prim.dataset.used = 'false';
                });
            checkForSubmit()
        }

        if (event.target.id === 'open'){
            answerDisplay.innerText = convertActionStackToString();
            openParens++;
            enableUnusedPrims();
            disableAllOps();
            disableCloseParen();
        }

        if (event.target.id === 'close'){            
            openParens--;
            answerDisplay.innerText = convertActionStackToString();
            checkForSubmit()
            enableCloseParenIfOpenParens();
        }


        if (event.target.id == 'submit'){
            if (math.evaluate(answerDisplay.innerText) == problem.finalAnswer()){
                alert('Correct!')
            } else {
                alert(`WROOOOOOONG! Your answer: ${math.evaluate(answerDisplay.innerText)}`)
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

    function enableCloseParenIfOpenParens(){
        if (openParens > 0){
            enableCloseParen();
        } else {
            disableCloseParen();
        }
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

    function startTimer(time = 120000){
        let seconds = time/1000;
        let timeEle = document.querySelector('#time');
        timeEle.innerText = `${convertSecToMin(seconds)}`;
        let timer = setInterval(decrementTimer, 1000);

    }

    function decrementTimer(){
        let timeEle = document.querySelector('#time');
        console.log('tick')
        let time = convertMinToSec(timeEle.innerText)
        if (time > 0){
            time--
            timeEle.innerText = convertSecToMin(time);
            console.log(timeEle)
        }
    }

    function convertMinToSec(timeString){
        console.log(timeString)
        let [minutes, seconds] = timeString.split(':');
        let totalSeconds = (parseInt(minutes) * 60) + parseInt(seconds);
        return totalSeconds;
    }

    function convertSecToMin(totalSeconds){
        let minutes = Math.floor(totalSeconds/60);
        let seconds = totalSeconds%60;

        if (seconds < 10){
            seconds = '0' + seconds;
        }

        return `${minutes}:${seconds}`
    }

    function convertActionStackToString(){
        let str = '';
        let actionArray = Array.from(actionStack);
        actionArray.forEach(ele => {
            str += ele.innerText;
        })
        return str;
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
