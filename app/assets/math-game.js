const URL_PREFIX = 'http://localhost:3000';

document.addEventListener("DOMContentLoaded", ()=> {
    const pages = Array.from(document.querySelectorAll('.page'));
    const gameBox = document.querySelector('#game-box');
    const selectDifficulty = document.querySelector('#select-difficulty');
    const resultsPage = document.querySelector('#results-page')
    const answerDisplay = document.querySelector('#answer-display');
    const submitButton = document.querySelector('#submit');
    const newGameButton = document.querySelector('#new-game');
    const scoreBoard = document.getElementById("score-board");
    const submitNameform = document.getElementById("username-form");
    const leaderboard = document.getElementById("leaderboard");
    const countdown = document.getElementById("countdown");
    const navigateMusic = new Audio('menu-navigate.wav');
    const selectMusic = new Audio('select.wav');
    const startMusic = new Audio('start.wav');
    const overlay = document.getElementById("overlay");
    let gameTimer;
    let countDownTimer;
    let openParens = 0;
    let actionStack = [];
    let currentGame;

    newGameButton.addEventListener('click', e => {
        startMusic.play();
        goToPage(selectDifficulty);
        overlay.display = "none";
    })

    selectDifficulty.addEventListener('mouseover',() =>{
        navigateMusic.play();
        
    })

    selectDifficulty.addEventListener('click', (event) => {
        startMusic.play();
        if (event.target.className == 'new-game'){
            goToPage(gameBox);
            countDownTimer = setInterval(countDown.bind(null,event.target.id), 1000);
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

        if (event.target.classList[0] === "fas" && event.target.id !== "undoIcon" ) {
            actionStack.push(event.target.parentNode);
            enableUnusedPrims();
            disableCloseParen();
            disableAllOps();
            answerDisplay.innerText = convertActionStackToString();
        }

        if (event.target.className === 'operator'){
            actionStack.push(event.target);
            enableUnusedPrims();
            disableCloseParen();
            disableAllOps();
            answerDisplay.innerText = convertActionStackToString();
        }
        if (event.target.id === 'undo' || event.target.id === "undoIcon") {
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
            let userAnswer = answerDisplay.innerText;
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

        if (time > 0) {
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
        event.preventDefault();
        submitGame(currentGame, event.target.name.value)
        .then(getTopTen(currentGame.difficulty))
        .then(goToPage(leaderboard))
    })

    function rightAnswer() {
        (currentGame.lastProblem()).solved = true;
        currentGame.score++;
        let rightIcon = document.createElement("i");
        rightIcon.classList.add('fas', 'fa-check','fa-2x');
        scoreBoard.appendChild(rightIcon);
        displayScore();
        currentGame.createProblem();
    }
    function wrongAnswer() {
        (currentGame.lastProblem()).solved = false;
        let wrongIcon = document.createElement("i");
        wrongIcon.classList.add('fas', 'fa-times', 'fa-2x');
        wrongIcon.style.color = "red"; 
        scoreBoard.appendChild(wrongIcon);
        displayScore();
        currentGame.createProblem();

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
        displayScore();
        currentGame.createProblem();
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
            }
        } else {
            enableOpenParen();
            submitButton.disabled = true;
        }
    }

    function startTimer(seconds = 120){
        let timeEle = document.querySelector('#time');
        timeEle.innerText = `${convertSecToMin(seconds)}`;
        gameTimer = setInterval(decrementTimer, 1000);
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
            clearInterval(gameTimer);
            // show result screen
            // ask user what to do
            currentGame.problemRecord.pop();
             finishGame()
        }
    }

    function finishGame(){
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

        })
        toggleButtons()
        return str;
    }
   
    function goToPage(pageName){
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
        return fetch(`${URL_PREFIX}/games`)
        .then(res => res.json())
    }

    function getTopTen(difficulty){
        getAllGames()
        .then(json => {
            debugger;
            let gameArray = json.filter((game) => checkDifficulty(game, game.difficulty))
            gameArray.sort((a, b) => parseInt(b.score) - parseInt(a.score));
            let topTen = gameArray.slice(0, 10);
            displayLeaderBoard(topTen);
        })
    }


    function displayLeaderBoard(topTen){
        
        let ol = document.querySelector('#top-ten');

        topTen.forEach(game => {
            let entry = document.createElement('li');
            entry.innerText = `${game.user}         Score: ${game.score}`

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


})// end of DOMContentLoaded
