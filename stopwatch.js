const stopWatchDisplay = document.getElementById("stopWatchDisplay");
const startStopButton = document.getElementById("startStopButton");
let running = false;
let time = 0;

startStopButton.addEventListener("click", function(event){
    if(running === false){
        countingInterval = setInterval(countUp, 10)
        running = true;
        startStopButton.innerText = "Stop"
    }
    else{
        clearInterval(countingInterval)
        running = false;
        startStopButton.innerText = "Start"
    }
})

function countUp(){
    time++;
    stopWatchDisplay.innerText = formatTime(time);

}

function formatTime(time){
    minutes = Math.floor(time / 600)
    seconds = Math.floor(time / 100)
    milliseconds = (time % 100);
    return minutes.toString().padStart(0,2) + seconds.toString().padStart(2,0) + ":" + milliseconds.toString().padStart(2,0);
}