//needs tones.js

function checkAnswer(event){
    result = document.getElementById("answer-result");
    correctAnswer = document.getElementById("correct-answer");
    if (event.target == correctAnswer) {
        result.style.color = "green";
        result.innerHTML = "Correct!";
    }
    else {
        result.style.color = "red";
        result.innerHTML = "Incorrect...";
    }
}

function makeAnswerButtons(optionObject) {
    var AnswerBtns = document.getElementsByClassName("answer-button");
    var numBtns = AnswerBtns.length;
    if (numBtns <= 0) {
        // console.log("Error: no buttons!");
        return false;
    }
    // console.log(numBtns);
    //create / clone other buttons if there are fewer buttons than options
    answerBtnContainer = document.getElementById("answer-button-container");
    for (var i = 0; i < optionObject.length - numBtns; i++) {
        var newBtn = AnswerBtns[0].cloneNode(false);
        answerBtnContainer.appendChild(newBtn);
    }
    //else buttons already there, skip creation step
    var numBtns = AnswerBtns.length;
    // console.log("numBtns after cloning:" + numBtns);
    if (numBtns != optionObject.length) {
        // console.log("wrong number of buttons");
        return false;
    }
    for (var i = 0; i < numBtns; i++) {
        var currInterval = optionObject[i];
        var currBtn = AnswerBtns[i];
        currBtn.innerHTML = currInterval["interval_name"];
        // console.log("currInterval:" + currInterval["interval_name"]);
        // console.log(currBtn.innerHTML);
    }
}

function setupListeners() {
    var topButton = document.getElementById("top-note-button");
    var bottomButton = document.getElementById("bottom-note-button");
    var bothButton = document.getElementById("both-notes-button");

    topButton.addEventListener("click", function() {
        // console.log("playing note " + topNoteName + " " + topNoteOctave.toString());
        tones.play(window.topNoteName, window.topNoteOctave);
    });
    bottomButton.addEventListener("click", function() {
        // console.log("playing note " + bottomNoteName + " " + bottomNoteOctave.toString());
        tones.play(window.bottomNoteName, window.bottomNoteOctave);
    });
    bothButton.addEventListener("click", function() {
        // console.log("playing note " + topNoteName + " " + topNoteOctave.toString());
        tones.play(window.topNoteName, window.topNoteOctave);
        // setTimeout(function(){ return; }, 2000);
        // console.log("playing note" + bottomNoteName + " " + bottomNoteOctave.toString());
        tones.play(window.bottomNoteName, window.bottomNoteOctave);
        // setTimeout(tones.play, 300, bottomNoteName, bottomNoteOctave);
    });
    // answers = document.getElementsByClassName("answer-button");
    // for(var i = 0; i < answers.length; i++){
    //     answers[i].addEventListener("click", checkAnswer);
    // }

    tones.type = "square";
    tones.release = 200;

    var next = document.getElementById("next");
    next.addEventListener("click", getExercise);
}

function newExercise() {
    if(this.responseText) {
        console.log(this.responseText);
        window.intervalSet = JSON.parse(this.responseText);
    }
    else {
        console.log("No JSON data");
        console.log(this.responseText);
    }
    makeAnswerButtons(intervalSet);
    for(var i = 0; i < intervalSet.length; i++) {
        window.curr = intervalSet[i];
        window.intervalName = curr.interval_name;
        window.topNoteName = curr.top_note.name;
        window.topNoteOctave = parseInt(curr.top_note.octave);
        window.bottomNoteName = curr.bottom_note.name;
        window.bottomNoteOctave = parseInt(curr.bottom_note.octave);
    }
    // var tClone = topButton.cloneNode(true);
    // tClone.parentNode.replaceChild(tClone, topButton);

}

function getExercise(){
    var request = new XMLHttpRequest();
    request.onload = newExercise;
    request.open("GET", "/get-interval-set/", true);
    request.send();
}

document.addEventListener("DOMContentLoaded", getExercise);
document.addEventListener("DOMContentLoaded", setupListeners);
