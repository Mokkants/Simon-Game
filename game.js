var inputLock = true; //Prevent player from interacting until false
var gameInProgress = false;

var difficulty = 1; //No. of buttons added to the sequence per round
var sequence = []; //Color sequence
var inputSequence = []; //Sequence entered by player

var recordCorrectInputs = 0;
var currentCorrectInputs = 0;

//Number associated with markup id
var colorButtonIDs = Object.freeze({
    1:"button-top-left",
    2:"button-top-right",
    3:"button-bottom-left",
    4:"button-bottom-right"
});

var stringConstants = Object.freeze({
    ACTIVE_CLASS_NAME : "active",
    COOLDOWN_CLASS_NAME : "cooling-down",
    START_ICON_CLASS_NAME: "fa-play",
    TIMER_ICON_CLASS_NAME: "fa-stopwatch",
});

var winRoundIcons = Object.freeze({
    WIN_ROUND_ICON_1_CLASS_NAME: "fa-smile-beam",
    WIN_ROUND_ICON_2_CLASS_NAME: "fa-thumbs-up",
    WIN_ROUND_ICON_3_CLASS_NAME: "fa-medal",
    WIN_ROUND_ICON_4_CLASS_NAME: "fa-heart"
});

var loseRoundIcons = Object.freeze({
    LOSE_ROUND_ICON_1_CLASS_NAME: "fa-sad-tear",
    LOSE_ROUND_ICON_2_CLASS_NAME: "fa-skull",
    LOSE_ROUND_ICON_3_CLASS_NAME: "fa-thumbs-down",
    LOSE_ROUND_ICON_4_CLASS_NAME: "fa-heart-broken",
});

var timeConstants = Object.freeze({
    PLAY_ROUND_INTERVAL : 1000,
    BUTTON_FIRE_DURATION : 300,
    BUTTON_FIRE_INTERVAL : 1000,
    BUTTON_FIRE_INPUT_LOCK_DURATION : 200,
    BUTTON_COOLDOWN_DURATION: 10
});

//Start game
function startGame(){
    gameInProgress = true;
    playRound();   
}

//Add new item to sequence and play it
function playRound(){
    if(inputSequence.length === sequence.length){
        updateRecordScore();
        inputLock = true;
        addSequenceItems(difficulty);
        inputSequence=[];
        setTimeout(playSequence, timeConstants.PLAY_ROUND_INTERVAL, 0);
    }
}

//Add new item to sequence (1-3 dep. on difficulty)
function addSequenceItems(difficulty){
    for(i=0;i<difficulty;i++){
        var id = Math.floor(Math.random() * 4) + 1; //Between 1 and 4
        sequence.push(id);
    }
}

//Fire buttons in the sequence (recursively, with delay)
function playSequence(index){
    //Fetch corresponding element
    var el = document.getElementById([colorButtonIDs[sequence[index]]]); 
    fireButton(el);

    if(sequence.length-1 !== index){
        setTimeout(playSequence,timeConstants.BUTTON_FIRE_INTERVAL,index+1);
    }
    else{ //Unlock interaction once sequence is over
        inputLock=false;
    }
}

//Light up button
function fireButton(el){
    var activateButton = function(el){
        el.classList.add(stringConstants.ACTIVE_CLASS_NAME);
        el.classList.add(stringConstants.COOLDOWN_CLASS_NAME);
    };
    var deactivateButton = function(el){
        el.classList.remove(stringConstants.ACTIVE_CLASS_NAME)
        setTimeout(function(){
            el.classList.remove(stringConstants.COOLDOWN_CLASS_NAME);
        }, timeConstants.BUTTON_COOLDOWN_DURATION);
    };

    activateButton(el);
    setTimeout(deactivateButton, timeConstants.BUTTON_FIRE_DURATION, el);
}

//Enter input sequence
function onClickButton(el)
{
    if(inputLock) return; //Stop player from interacting
    if(el.classList.contains(stringConstants.COOLDOWN_CLASS_NAME)) return;
    inputLock=true;

    var id = Object.keys(colorButtonIDs).find(key => colorButtonIDs[key] === el.id);
    inputSequence.push(parseInt(id,10));

    if(checkInputMatch()){
        currentCorrectInputs++;
        fireButton(el);
        //Temporarily lock input
        setTimeout(()=>inputLock = false, timeConstants.BUTTON_FIRE_INPUT_LOCK_DURATION);
        //Matchup timeout with input lock to avoid input between rounds
        setTimeout(playRound,timeConstants.BUTTON_FIRE_INPUT_LOCK_DURATION);
    }
    else{
        //Game over, reset
        gameInProgress = false;
        sequence=[];
        inputSequence=[];
        currentCorrectInputs = 0;
    }
}

function checkInputMatch(){
    return sequence[inputSequence.length-1] === inputSequence[inputSequence.length-1];
}

function updateRecordScore(){
    if(currentCorrectInputs > recordCorrectInputs){
        recordCorrectInputs = currentCorrectInputs;
        document.getElementById("top-score").innerHTML = recordCorrectInputs.toString();
    }
    currentCorrectInputs = 0;
}

function onSetDifficulty(newDiff){
    if(gameInProgress) return; //Only allow difficulty change when not playing
    difficulty = newDiff;
}

function onClickPanelButton(){
    if(!gameInProgress){
        startGame();
    }
}