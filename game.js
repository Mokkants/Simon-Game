var inputLock = true; //Prevent player from interacting until false
var difficulty = 1; //No. of buttons added to the sequence per round
var sequence = []; //Color sequence
var inputSequence = []; //Sequence entered by player

//Number associated with markup id
var ids = Object.freeze({
    1:"button-top-left",
    2:"button-top-right",
    3:"button-bottom-left",
    4:"button-bottom-right"
});

var timeConstants = Object.freeze({
    PLAY_ROUND_INTERVAL : 1000,
    BUTTON_FIRE_DURATION : 500,
    BUTTON_FIRE_INTERVAL : 1000,
    BUTTON_FIRE_INPUT_LOCK_DURATION : 200
});

//Start game
function onClickPlay(){
    playRound();   
}

//Add new item to sequence and play it
function playRound(){
    if(inputSequence.length === sequence.length){
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
    var el = document.getElementById([ids[sequence[index]]]); 
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
    var activeClassName = "active";

    var activateButton = function(el){el.classList.add(activeClassName)};
    var deactivateButton = function(el){el.classList.remove(activeClassName)};

    activateButton(el);
    setTimeout(deactivateButton, timeConstants.BUTTON_FIRE_DURATION, el);
}

//Enter input sequence
function onClickButton(el)
{
    if(inputLock) return; //Stop player from interacting

    var id = Object.keys(ids).find(key => ids[key] === el.id);
    inputSequence.push(parseInt(id,10));

    if(checkInputMatch()){
        fireButton(el);
        //Temporarily lock input
        inputLock=true;
        setTimeout(()=>inputLock = false, timeConstants.BUTTON_FIRE_INPUT_LOCK_DURATION);
        
        playRound();
    }
    else{
        //Game over, reset
        sequence=[];
        inputSequence=[];
        inputLock=true;
    }
}

function checkInputMatch(){
    return sequence[inputSequence.length-1] === inputSequence[inputSequence.length-1];
}