

document.addEventListener("DOMContentLoaded", ()=> {
    const pages = Array.from(document.querySelectorAll('.page'));
    const gameBox = document.querySelector('#game-box');
    const selectDifficulty = document.querySelector('#select-difficulty');
    const answerDisplay = document.querySelector('#answer-display');
    const submitButton = document.querySelector('#submit');
    const newGameButton = document.querySelector('#new-game');
    let open = document.querySelector('#open');
    let close = document.querySelector('#close');
    let ops = document.querySelectorAll('.operator');
    let openParens = 0;
    let actionStack = [];
    let currentGame;

    newGameButton.addEventListener('click', e => {
        goToPage(selectDifficulty);
    })

    selectDifficulty.addEventListener('click', (event) => {
        if (event.target.className == 'new-game'){
            startGame();
        }
    })
   
    gameBox.addEventListener('click', (event) => {
        if (event.target.className === 'prim'){
            actionStack.push(event.target);
            event.target.dataset.used = 'true';
            disableAllPrims();
            enableAllOps();
            checkForSubmit();
            enableCloseParenIfOpenParens();
            answerDisplay.innerText = convertActionStackToString();
        }

        if (event.target.className === 'operator'){
            actionStack.push(event.target);
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
                resetButtons();
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
            resetButtons();
        }

        if (event.target.id === 'open'){
            actionStack.push(event.target);
            answerDisplay.innerText = convertActionStackToString();
            openParens++;
            enableUnusedPrims();
            disableAllOps();
            disableCloseParen();
        }

        if (event.target.id === 'close'){
            actionStack.push(event.target);            
            openParens--;
            answerDisplay.innerText = convertActionStackToString();
            checkForSubmit()
            enableCloseParenIfOpenParens();
        }


        if (event.target.id == 'submit'){
            let userAnswer = math.evaluate(answerDisplay.innerText);
            if (userAnswer == (currentGame.lastProblem()).finalAnswer()){
                console.log(`${userAnswer} is Correct!`);
                (currentGame.lastProblem()).correct = true;
                currentGame.score++;
            } else {
                console.log(`${userAnswer} is Incorrect!`);
                (currentGame.lastProblem()).correct = false;
            }
            displayScore();
            currentGame.createProblem();
            resetButtons();
        }

        function resetButtons(){
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


        
    }) // end of gamebox eventListener

    function startGame() {
        let difficulty = event.target.id;
        currentGame = new Game(difficulty);
        displayScore();
        currentGame.createProblem();
        goToPage(gameBox);
        startTimer();
    }

    function displayScore(){
        let scoreRatio = document.querySelector('#score-ratio');
        let totalProbs = currentGame.problemRecord.length;
        scoreRatio.innerText = `${currentGame.score}/${totalProbs}`;
    }

    function enableUnusedPrims(){
        let prims = document.querySelectorAll('.prim');
        prims.forEach((prim) => {
            // debugger
           if (prim.dataset.used == 'false'){
                prim.disabled = false;
            }
            
        })
    }

    function disableAllPrims(){
        let prims = document.querySelectorAll('.prim');
        prims.forEach((prim) => prim.disabled = true)
    }

    function disableAllOps(){
 
        ops.forEach(op => op.disabled = true)
    }

    function enableAllOps(){
 
        ops.forEach(op => op.disabled = false)
    }

    function enableCloseParen(){
        close.disabled = false;
    }

    function disableCloseParen(){
        close.disabled = true;
    }

    function enableCloseParenIfOpenParens(){
        openParens > 0 ? enableCloseParen() : disableCloseParen();
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

    function startTimer(seconds = 120){
        let timeEle = document.querySelector('#time');
        timeEle.innerText = `${convertSecToMin(seconds)}`;
        timer = setInterval(decrementTimer, 1000);
    }

    function decrementTimer(){
        let timeEle = document.querySelector('#time');
        let time = convertMinToSec(timeEle.innerText)
        if (time > 0){
            time--;
            timeEle.innerText = convertSecToMin(time);
        }
        else {
            alert("game is over");
            clearInterval(timer);
            // show result screen
            // ask user what to do
            // finishGame()
        }
    }

    function convertMinToSec(timeString){
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
        let actionArray = Array.from(actionStack);
        return actionArray.reduce((actions,currAction) => actions + currAction.innerText,'');
    }
   
    function goToPage(pageName){
        pages.forEach(page => {page.style.display = 'none'})
        pageName.style.display = 'block';
    }
})// end of DOMContentLoaded
