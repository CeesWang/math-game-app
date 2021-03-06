const URL_PREFIX = 'http://localhost:3000';
const GAME_DURATION_SEC = 120;

document.addEventListener("DOMContentLoaded", ()=> {
    const pages = Array.from(document.querySelectorAll('.page'));
    const gameBox = document.querySelector('#game-box');
    const titleScreen = document.querySelector('#title-screen')
    const selectDifficulty = document.querySelector('#select-difficulty');
    const resultsPage = document.querySelector('#results-page')
    const answerDisplay = document.querySelector('#answer-display');
    const submitButton = document.querySelector('#submit');
    const newGameButton = document.querySelector('#new-game');
    const scoreBoard = document.getElementById("score-board");
    const submitNameform = document.getElementById("username-form");
    const leaderboard = document.getElementById("leaderboard");
    const toMenu = document.getElementsByClassName("to-menu");
    const countdown = document.getElementById("countdown");
    const navigateMusic = new Audio('menu-navigate.wav');
    const selectMusic = new Audio('select.wav');
    const startMusic = new Audio('start.wav');
    const wrongBuzzer = new Audio('wrong.wav');
    const correctDing = new Audio('correct.wav');
    const timesUp = new Audio('timesUp.wav');
    const overlay = document.getElementById("overlay");
    const beep = new Audio('buttonBeep.wav');
    const themeSong = new Audio('themeSong.wav');
    const hooray = new Audio('hooray.wav');
    let gameTimer;
    let countDownTimer;
    let openParens = 0;
    let actionStack = [];
    let currentGame;
    let allButtonss;
    // let activeButtonss = allButtonss.filter(button => button.disabled == false);


    const [one,two,three,four,five,six,seven,eight,nine] = [49,50,51,52,53,54,55,56,57];
    const [multiplication,minus,division,plus,submit,openParen,closeParen,clear] = [42,45,47,43,13,40,41,99];


    newGameButton.addEventListener('click', e => {
        startMusic.play();
        
        goToPage(selectDifficulty);
        overlay.display = "none";
    })

    selectDifficulty.addEventListener('mouseover',() =>{
        navigateMusic.play();
        
    })

    document.addEventListener('click', e => {
        if (e.target.className == 'to-title-screen'){
            goToPage(titleScreen);
        }
    })



    selectDifficulty.addEventListener('click', (event) => {
        let primitives = document.querySelector('#primitives');
        primitives.innerHTML = '';
        let targetNumber = document.querySelector('#target-number');
        targetNumber.innerText = '';
        startMusic.play();
        if (event.target.className == 'new-game'){
            countDown.innerText = '3';
            openParens = 0;
            actionStack = [];
            currentGame = '';
            scoreBoard.innerHTML = ``;
  
            goToPage(gameBox);
            countDownTimer = setInterval(countDown.bind(null,event.target.id), 1000);
        }
    })

    document.addEventListener('keydown', event => {
        if (event.keyCode == 8){
            backspace();
        }
    })

    document.addEventListener('keypress', (event) =>{
        console.log(event.keyCode);
        let button = convertKeypressToButton(event.keyCode);
        if (button != undefined){
            if (button.className === 'prim'){
                beep.play();
                actionStack.push(button);
                button.dataset.used = 'true';
                disableAllPrims();
                enableAllOps();
                checkForSubmit();
                enableCloseParenIfOpenParens();
                answerDisplay.innerText = convertActionStackToString();
            }

            if (button.classList[0] === "fas" && button.id !== "undoIcon" ) {
                beep.play();
                actionStack.push(button.parentNode);
                enableUnusedPrims();
                disableCloseParen();
                disableAllOps();
                answerDisplay.innerText = convertActionStackToString();
            }

            if (button.className === 'operator'){
                beep.play();
                actionStack.push(button);
                enableUnusedPrims();
                disableCloseParen();
                disableAllOps();
                answerDisplay.innerText = convertActionStackToString();
            }
            if (button.id === 'undo' || button.id === "undoIcon") {
                beep.play();
                let lastAction = actionStack.pop();
                answerDisplay.innerText = convertActionStackToString();
                if(lastAction.className == 'prim'){
                    lastAction.dataset.used = 'false';
                    enableUnusedPrims();
                    disableAllOps();
                    checkForSubmit();
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
                }}
            

            if (button.id === 'clear'){
                beep.play();
                resetButtons();
            }

            if (button.id === 'open'){
                beep.play();
                actionStack.push(button);
                answerDisplay.innerText = convertActionStackToString();
                openParens++;
                enableUnusedPrims();
                disableAllOps();
                disableCloseParen();
            }

            if (button.id === 'close'){
                beep.play();     
                actionStack.push(button);       
                openParens--;
                answerDisplay.innerText = convertActionStackToString();
                checkForSubmit()
                enableCloseParenIfOpenParens();
            }


            if (button.id == 'submit'){
                let userAnswer = convertActionStackToString();
                let userAnswerValue = math.evaluate(userAnswer);

                (currentGame.lastProblem()).userAnswer = userAnswer;
                (currentGame.lastProblem()).userAnswerValue = userAnswerValue;

                if (userAnswerValue == (currentGame.lastProblem()).target()){
                    console.log(`${userAnswer} is Correct!`);
                    rightAnswer();
                } else {
                    console.log(`${userAnswer} is Incorrect!`);
                    wrongAnswer();
                }
                resetButtons();
            }
        }
    })

   function backspace(){
    beep.play();
    let lastAction = actionStack.pop();
    answerDisplay.innerText = convertActionStackToString();
    if(lastAction.className == 'prim'){
        lastAction.dataset.used = 'false';
        enableUnusedPrims();
        disableAllOps();
        checkForSubmit();
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

    gameBox.addEventListener('click', (event) => {
        if (event.target.className === 'prim'){
            beep.play();
            actionStack.push(event.target);
            event.target.dataset.used = 'true';
            disableAllPrims();
            enableAllOps();
            checkForSubmit();
            enableCloseParenIfOpenParens();
            answerDisplay.innerText = convertActionStackToString();
        }

        if (event.target.classList[0] === "fas" && event.target.id !== "undoIcon" ) {
            beep.play();
            actionStack.push(event.target.parentNode);
            enableUnusedPrims();
            disableCloseParen();
            disableAllOps();
            answerDisplay.innerText = convertActionStackToString();
        }

        if (event.target.className === 'operator'){
            beep.play();
            actionStack.push(event.target);
            enableUnusedPrims();
            disableCloseParen();
            disableAllOps();
            answerDisplay.innerText = convertActionStackToString();
        }
        if (event.target.id === 'undo' || event.target.id === "undoIcon") {
            beep.play();
            let lastAction = actionStack.pop();
            answerDisplay.innerText = convertActionStackToString();
            if(lastAction.className == 'prim'){
                lastAction.dataset.used = 'false';
                enableUnusedPrims();
                disableAllOps();
                checkForSubmit();
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
            checkforSubmit()
         }

        if (event.target.id === 'clear'){
            beep.play();
            resetButtons();
        }

        if (event.target.id === 'open'){
            beep.play();
            actionStack.push(event.target);
            answerDisplay.innerText = convertActionStackToString();
            openParens++;
            enableUnusedPrims();
            disableAllOps();
            disableCloseParen();
        }

        if (event.target.id === 'close'){
            beep.play();     
            actionStack.push(event.target);       
            openParens--;
            answerDisplay.innerText = convertActionStackToString();
            checkForSubmit()
            enableCloseParenIfOpenParens();
        }


        if (event.target.id == 'submit'){
            let userAnswer = convertActionStackToString();
            let userAnswerValue = math.evaluate(userAnswer);

            (currentGame.lastProblem()).userAnswer = userAnswer;
            (currentGame.lastProblem()).userAnswerValue = userAnswerValue;

            if (userAnswerValue == (currentGame.lastProblem()).target()){
                console.log(`${userAnswer} is Correct!`);
                rightAnswer();
            } else {
                console.log(`${userAnswer} is Incorrect!`);
                wrongAnswer();
            }
            resetButtons();
        }
    }) // end of gamebox eventListener

    function countDown(difficulty){
        let time = parseInt(countdown.innerText);

        if (time > 1) {
            time--;
            countdown.innerText = time;    
        }
        else {
            clearInterval(countDownTimer);
            overlay.style.display = "none";
            startGame(difficulty);
        }
    }
    
    submitNameform.addEventListener('submit', event => {
        currentGame.user = event.target.name.value;
        event.preventDefault();
        submitGame(currentGame, event.target.name.value)
        .then(getTopTen(currentGame.difficulty))
        
        setTimeout(goToPage(leaderboard), 3000)
    })

    function rightAnswer() {
        (currentGame.lastProblem()).solved = true;
        currentGame.score++;
        correctDing.play();
        let rightIcon = document.createElement("i");
        rightIcon.classList.add('fas', 'fa-check','fa-2x');
        rightIcon.style.marginLeft = "5px";
        scoreBoard.appendChild(rightIcon);
        //displayScore();
        currentGame.createProblem();
        allButtonss = Array.from(document.getElementsByTagName("button"));
    }
    function wrongAnswer() {
        (currentGame.lastProblem()).solved = false;
        wrongBuzzer.play();
        let wrongIcon = document.createElement("i");
        wrongIcon.classList.add('fas', 'fa-times', 'fa-2x');
        wrongIcon.style.color = "red";
        wrongIcon.style.margin = "5px"; 
        scoreBoard.appendChild(wrongIcon);
       // displayScore();
        currentGame.createProblem();
        allButtonss = Array.from(document.getElementsByTagName("button"));
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

    function startGame(difficulty) {
        // let difficulty = event.target.id;
        currentGame = new Game(difficulty);
        answerDisplay.innerText = '';
        console.log(currentGame);
//        displayScore();
   
        currentGame.createProblem();
        allButtonss = Array.from(document.getElementsByTagName("button"));
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
        let ops = document.querySelectorAll('.operator');
        ops.forEach(op => op.disabled = true)
    }

    function enableAllOps(){
        let ops = document.querySelectorAll('.operator');
        ops.forEach(op => op.disabled = false)
    }

    function enableCloseParen(){
        let close = document.querySelector('#close');
        close.disabled = false;
    }

    function disableCloseParen(){
        let close = document.querySelector('#close');
        close.disabled = true;
    }

    function enableOpenParen(){
        let open = document.querySelector('#open');
        open.disabled = false;
    }

    function disableOpenParen(){
        let open = document.querySelector('#open');
        open.disabled = true;
    }

    function enableCloseParenIfOpenParens(){
        openParens > 0 ? enableCloseParen() : disableCloseParen();
    }
   
    function checkForSubmit(){
        let prims = Array.from(document.querySelectorAll('.prim'));
        let open = document.querySelector('#open');

        if(prims.every(prim => prim.dataset.used == 'true')){
            disableAllPrims();
            disableAllOps();
            disableOpenParen();
            if (openParens == 0){
              submitButton.disabled = false;      
            } else {
                submitButton.disabled = true;
            }
        } else {
            enableOpenParen();
            submitButton.disabled = true;
        }
    }

    function startTimer(seconds = GAME_DURATION_SEC){
        let timeEle = document.querySelector('#time');
        timeEle.innerText = `${convertSecToMin(seconds)}`;
        gameTimer = setInterval(decrementTimer, 1000);
        themeSong.loop = true;
        themeSong.play();
        themeSong.loop = true;
    }

    function decrementTimer(){
        let timeEle = document.querySelector('#time');
        let time = convertMinToSec(timeEle.innerText)
        if (time > 0){
            time--;
            timeEle.innerText = convertSecToMin(time);
        }
        else {
            //alert
            clearInterval(gameTimer);
            themeSong.loop = false;
            themeSong.pause();
            themeSong.loop = false;
            overlay.style.display = "block";
            countdown.innerText = "Times Up"
            timesUp.play();

            // show result screen
            // ask user what to do
            currentGame.problemRecord.pop();
            setTimeout(finishGame,2000);
        }
    }

    function finishGame(){
        countdown.innerText = "3";
        let targetNumber = document.querySelector('#target-number');
        let primitives = document.querySelector('#primitives');
        answerDisplay.innerText = '';
        primitives.innerHTML = "";
        targetNumber.innerText = "";
        currentGame.displayGameResults();
        goToPage(resultsPage);
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
        let str = '';
        let actionArray = Array.from(actionStack);
        actionArray.forEach(ele => {
            if (ele.className === "operator") {
                str += ele.id;
            }
            else {
                str += ele.innerText;
            }
            str += ' '
        })
        toggleButtons()
        return str;
    }
   
    function goToPage(pageName){
        console.log(`goToPage ${pageName.id}`)
        pages.forEach(page => {page.style.display = 'none'})
        pageName.style.display = 'block';
    }

    function toggleButtons(){
        checkForSubmit();
        let actionArray = Array.from(actionStack);
        if(actionArray.length > 0){
            let lastAction = actionArray[actionArray.length-1];

            switch(lastAction){
                case lastAction.class == 'prim': 
                    disableAllPrims();
                    enableAllOps();
                    enableCloseParenIfOpenParens();
                    checkForSubmit();
                    break;
                case lastAction.class == 'operator':
                    enableUnusedPrims();
                    disableAllOps();
                    break;
                case lastAction.id == 'open':
                    enableUnusedPrims();
                    disableAllOps();
                    disableCloseParen();
                     break;
                case lastAction.id == 'close':
                    checkForSubmit()
                    enableCloseParenIfOpenParens();
                    break;
                default:
                    break
            }
        }
    }

    function submitGame(game, userName='guest'){
        return fetch(`${URL_PREFIX}/games`,{
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            body: JSON.stringify({
            "user": userName,
            "difficulty": game.difficulty,
            "score": game.score,
            "problem_count": game.problemRecord.length
            })
        })
        .then(res => res.json())
    }

    function getAllGames(){
        console.log('getAllGames')
        return fetch(`${URL_PREFIX}/games`)
        .then(res => res.json())
    }

    function getTopTen(difficulty){
        getAllGames()
        .then(json => {
            console.log('getTopTen')
            let gameArray = json.filter((game) => checkDifficulty(game, difficulty));
            gameArray.push(currentGame);    //push your own game into it
            gameArray.sort((a, b) => parseInt(b.score) - parseInt(a.score));
            let topTen = gameArray.slice(0, 10);
            let yourInTheTopTen = topTen.find(game => game === currentGame);
            displayLeaderBoard(topTen); 
        })   
    }


    function displayLeaderBoard(topTen){
        console.log('displayLeaderBoard')
        let lbDifficulty = document.querySelector('#lb-difficulty');
        lbDifficulty.innerText = currentGame.difficulty;
        let ol = document.querySelector('#top-ten');
        ol.innerHTML = ``;

        topTen.forEach(game => {
            let entry = document.createElement('li');
            if (game === currentGame) {
                hooray.play();
                entry.innerHTML = `<div class="leader-row you-made-it" style="text-shadow: 2px 2px 4px goldenrod, 2px 2px 8px whitesmoke;">
                <div class="leader-name">${game.user}</div><div class="leader-score">${game.score}</div>
                 </div>`
            }
            else {
            entry.innerHTML = `<div class="leader-row">
               <div class="leader-name">${game.user}</div><div class="leader-score">${game.score}</div>
                </div>`
            }
            ol.append(entry)
        })

    }

    function checkDifficulty(game, difficulty){
        return game.difficulty == difficulty;
    }


    // STRETCH GOAL:
    // function submitProblem(problem, game){
    //     return fetch(`${URL_PREFIX}/problems`,{
    //         method: 'POST',
    //         headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //         },
    //         body: JSON.stringify({
    //         "target": problem.target,
    //         "solution": problem.target(),
    //         "user_answer": problem.userAnswer,
    //         "user_answer_value": problem.userAnswerValue,
    //         "solved": problem.solved,
    //         "game_id": game.id
    //         })
    //     })
    //     .then(res => res.json())

    // }
function convertKeypressToButton(keycode) {
    // let [one,two,three,four,five,six,seven,eight,nine] = [49,50,51,52,53,54,55,56,57];
    // // debugger;
    // let multiplication = 42;
    // let minus = 45; 
    // let division = 47;
    // let plus = 43;
    // let submit = 13;
    // let openParen = 40;
    // let closeParen = 41;
    // let clear = 99;
    // let multiplicationButton = 42;
    // let minusButton = 45; 
    // let divisionButton = 47;
    // let plusButton = 43;
    // let submitButton = 13;
    // let openParenButton = 40;
    // let closeParenButton = 41;
    // let clearButton = 99;
    

    // let allButtonss = Array.from(document.getElementsByTagName("button"));
    let targetButton;
    let activeButtonss = allButtonss.filter(button => button.disabled == false);

    switch (keycode) {
        case one:
            return activeButtonss.find(press => press.dataset.value == 1);
            break;
        case two:
            return activeButtonss.find(press => press.dataset.value == 2);            
            break;
        case three:
            return activeButtonss.find(press => press.dataset.value == 3);
            break;
        case four:
            return activeButtonss.find(press => press.dataset.value == 4);
            break;
        case five:
                return activeButtonss.find(press => press.dataset.value == 5);
            break;            
        case six:
                return activeButtonss.find(press => press.dataset.value == 6);
            break;
        case seven:
                return activeButtonss.find(press => press.dataset.value == 7);
            break;
        case eight:
                return activeButtonss.find(press => press.dataset.value == 8);
            break;
        case  nine:
                return activeButtonss.find(press => press.dataset.value == 9);
            break;
        case multiplication:
                return activeButtonss.find(press => press.id == "*");
            break;
        case minus:
                return activeButtonss.find(press => press.id == "-");
            break;
        case division:
                return activeButtonss.find(press => press.id == "/");
            break;
        case plus:
                return activeButtonss.find(press => press.id == "+");
            break;
        case submit:
                return activeButtonss.find(press => press.id == "submit");
            break;
        case openParen:
                return activeButtonss.find(press => press.id == "open");
            break;
        case closeParen:
                return activeButtonss.find(press => press.id == "close");
            break;
        case clear:
                return activeButtonss.find(press => press.id == "clear");
            break;
        default: 0; 
    }
}
})// end of DOMContentLoaded
