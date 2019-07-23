const activeClassName = "active";

let inputLock = true; //Prevent player from interacting until false
let difficulty = 1; //No. of buttons added to the sequence per round
let sequence = []; //Color sequence
let inputSequence = []; //Sequence entered by player

//Number associated with markup id
const ids = Object.freeze({
    1:"button-top-left",
    2:"button-top-right",
    3:"button-bottom-left",
    4:"button-bottom-right"
});

const findElementOfID = (id) => document.getElementById([ids[id]]);
const activateButton = (el) => el.classList.add(activeClassName);
const deactivateButton = (el) => el.classList.remove(activeClassName);

function onClickPlay(){
    setTimeout(playRound,100);    
}

function addSequenceItems(difficulty){
    for(i=0;i<difficulty;i++){
        let id = Math.floor(Math.random() * 4) + 1; //Between 1 and 4
        sequence.push(id);
    }
}

function fireButton(el){
    activateButton(el);
    setTimeout(deactivateButton, 500,el);
}

function playSequence(index){
    inputLock = true;
    let el = findElementOfID(sequence[index]);
    fireButton(el);

    //Repeat process until end of array
    index++;
    if(sequence.length !== index){
        setTimeout(playSequence,1000,index);
    }
    else{
        inputLock=false;
    }
}

function playRound(){
    if(inputSequence.length === sequence.length){
        addSequenceItems(difficulty);
        inputSequence=[];
        setTimeout(playSequence, 1000, 0);
    }
}

function checkInputMatch(){
    return sequence[inputSequence.length-1] === inputSequence[inputSequence.length-1];
}

function onClickButton(el)
{
    if(inputLock) return; //Stop player from interacting

    let id = Object.keys(ids).find(key => ids[key] === el.id);
    inputSequence.push(parseInt(id,10));

    if(checkInputMatch()){
        fireButton(el);
        inputLock=true;
        setTimeout(()=>inputLock = false, 200);
        
        playRound();
    }
    else{
        //Game over, reset
        sequence=[];
        inputSequence=[];
        inputLock=true;
    }
}