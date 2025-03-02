let secondsLeft = 0;
let paused = false;
let secondInterval = null;
let alerting = false;
let timeChanged = false;
let charactersRevealTime = 10;
let selectedCharacter = "darthSidious";

const startTime = document.getElementById("startTime")
const muter = document.getElementById("mute")
const timerInfo = document.getElementById("timerInfo")
const timer = document.getElementById("timer")
const alert = document.getElementById("timerAlert")
const lake = document.getElementById("lake");
const submit = document.getElementById("submit");
const timerDisplay = document.getElementById("timerDisplay");
const characterMaxRevealTime = 10;
const character = document.getElementById("character")
const characterChooser = document.getElementById("characterChooser")

const characters = {
    darthSidious: {image: "images/darth-sidious.jpg", audio: "audio/sidious.wav"},
    vector: {image: "images/vector.jpg", audio: "audio/vector.wav"}, 
    gru: {image: "images/gru2.jpg", audio: "audio/gru.wav"}, 
    donaldTrump: {image: "images/donald-trump.jpg", audio: "audio/donald-trump.wav"}
}

lake.play();

//Adds the colons to the input
startTime.addEventListener("input", function(){
    let value = this.value.replace(/:/g, "");
    value = this.value.replace(/[^0-9]/g, "");
    let length = value.length;
    if (length > 2 && length <= 4) {
        value = value.slice(0, length - 2) + ":" + value.slice(length - 2);
    }
    
    if (length >= 5){
        value = value.slice(0, length - 4) + ":" + value.slice(length - 4 , length - 2) + ":" + value.slice(length - 2);
    }
    
    this.value = value;
    timeChanged = true;
});

//When you click on submit
timerInfo.addEventListener("submit", function(event){
    event.preventDefault();

    if(alerting){
        pauseAlert();
        clearTimer();
    }
    //Run when the timer starts of when the user inputs a new time - initialize countdown
    else if(!paused && ((secondInterval === null) || timeChanged)){
        initializeTimer()
    }
    //Run if the timer is paused - unpause timer
    else if(paused){
        unpause();
    }

    //Run if the timer is counting down - pause timer
    else if(!paused && (secondInterval !== null)){
        paused = true;
        submit.value = "Start";
        timer.classList.toggle("paused")
        clearTimer();
    }  
});

function countDown(){
    if(!paused && secondsLeft > 0){
        secondsLeft--;
        timerDisplay.innerText = formatTime(secondsLeft);
        document.title = "Timer - " + formatTime(secondsLeft);
        let characterOpacity = (charactersRevealTime - secondsLeft) * 0.1;
        if (characterOpacity >= 0){
            character.style.opacity = characterOpacity;
            console.log(characterOpacity);
        }
        else{
            character.style.opacity = 0;
        }
        
    }
    if(secondsLeft <= 0){
        alert.play();
        clearTimer();
        alerting = true;
        submit.value = "Stop";
       character.style.opacity = 1;
    }
}

function parseTime(time){
    if(!time) {return 0};
    let timeList = time.split(":");
    if(timeList.some(isNaN)) {return 0};

    for(let i=0; i < timeList.length; i++){
        timeList[i] = Number(timeList[i])
    }

    let totalTime = Number(0)
    if (timeList.length === 3){
        totalTime += (timeList[0] * 3600);
        totalTime += (timeList[1] * 60);
        totalTime += (timeList[2]);
    }
    else if(timeList.length === 2){
        totalTime += (timeList[0] * 60);
        totalTime += (timeList[1]);
    }
    else{
        totalTime = timeList;
    }
    return totalTime;
}

function formatTime(time){
    if(time < 3600){
        let displayedSeconds = time % 60;
        let displayedMinutes = (time - displayedSeconds) / 60;
        displayedSeconds = displayedSeconds.toString().padStart(2,0);
        displayedMinutes = displayedMinutes.toString().padStart(2.0);
        return(displayedMinutes + ":" + displayedSeconds)
    }
    else{
        let displayedHours = Math.floor((time / 3600))
        let displayedMinutes = Math.floor((time % 3600) / 60)
        let displayedSeconds = time % 60;
        
        displayedSeconds = displayedSeconds.toString().padStart(2,0)
        displayedMinutes = displayedMinutes.toString().padStart(2,0);
        displayedHours = displayedHours.toString().padStart(2,0);
        return(displayedHours + ":" + displayedMinutes + ":" + displayedSeconds)
    }
    
}
function reset(){
    unpause();
    initializeTimer();
}


function clearTimer(){
    clearInterval(secondInterval);
    secondInterval = null;
}
function startTimer(){
    if(secondInterval === null){
        secondInterval = setInterval(countDown, 1000);
    }
}

function addTime(time){
    if((paused || secondInterval !== null) && secondsLeft > 0){
        secondsLeft += time;
        timerDisplay.innerText = formatTime(secondsLeft);
    }
}
function mute(){
    if(lake.paused === false){
        lake.pause();
        muter.innerText = "Play Background"
    }
    else{
        lake.play()
        muter.innerText = "Mute Background"

    }

}
function pauseAlert(){
    alert.pause();
    alerting = false;
    submit.value = "Start";
    character.style.transitionDuration = "0s";
    character.style.opacity = 0;
    paused = false

}
window.addEventListener("keydown", function(event){
        if(event.key === "m"){
            event.preventDefault()
            mute();
        }
        if(event.key === " " || event.key === "Enter"){
            event.preventDefault();
                submit.click();
        }
        if(event.key === "r"){
            reset();
        }
    });

startTime.addEventListener("blur", function () {
    if (isNaN(parseTime(this.value))) {
        alert("Please enter a valid time in HH:MM:SS format.");
        this.value = "";
    }
});

characterChooser.addEventListener("input", function(event){
    selectedCharacter = event.target.value;
    setCharacter(selectedCharacter);
})
function setCharacter(characterName){
    const characterInfo = characters[characterName];
            character.src = characterInfo.image;
            alert.src = characterInfo.audio;
}

function initializeTimer(){
    if(alerting){
        pauseAlert();
    }
    character.style.transitionDuration = "0s";
    character.style.opacity = 0;
    clearTimer();
        secondsLeft = parseTime(startTime.value || 0);
        if (secondsLeft > 0){
            paused = false;
            submit.value = "Pause";
            timerDisplay.innerText = formatTime(secondsLeft);
            timeChanged = false;
            setCharacter(selectedCharacter)
            startTimer();
            

            if(secondsLeft < characterMaxRevealTime){
                charactersRevealTime = secondsLeft;
                // character.style.transitionDuration = charactersRevealTime + "s";
            }
            else{
                charactersRevealTime = characterMaxRevealTime;
                //character.style.transitionDuration = charactersRevealTime + "s"
            }
            character.style.transitionDuration = "2s";
            //set the selected character
            setCharacter(selectedCharacter);
        }
}
function unpause(){
    if(paused){
        clearTimer();
        paused = false;
        submit.value = "Pause"
        timer.classList.toggle("paused")
        startTimer();
    }
}