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
        console.log("Error: no buttons!");
        return false;
    }
    console.log(numBtns);
    //create / clone other buttons if there are fewer buttons than options
    answerBtnContainer = document.getElementById("answer-button-container");
    for (var i = 0; i < optionObject.length - numBtns; i++) {
        var newBtn = AnswerBtns[0].cloneNode(false);
        answerBtnContainer.appendChild(newBtn);
    }
    //else buttons already there, skip creation step
    var numBtns = AnswerBtns.length;
    console.log("numBtns after cloning:" + numBtns);
    if (numBtns != optionObject.length) {
        console.log("wrong number of buttons");
        return false;
    }
    for (var i = 0; i < numBtns; i++) {
        var currInterval = optionObject[i];
        var currBtn = AnswerBtns[i];
        currBtn.innerHTML == currInterval["interval_name"];
    }
}

function newExercise() {
    var intervalSet = JSON.parse(this.responseText);
    makeAnswerButtons(intervalSet);
    var topButton = document.getElementById("top-note-button");
    var bottomButton = document.getElementById("bottom-note-button");
    var bothButton = document.getElementById("both-notes-button");
    var next = document.getElementById("next");

    for(var i = 0; i < intervalSet.length; i++) {
        var curr = intervalSet[i];
        if(curr.hasOwnProperty("correct")) {
          intervalName = curr.interval_name;
          topNoteName = curr.top_note.name;
          topNoteOctave = parseInt(curr.top_note.octave);
          bottomNoteName = curr.bottom_note.name;
          bottomNoteOctave = parseInt(curr.bottom_note.octave);
        }
    }
    topButton.addEventListener("click", function() {
        tones.play(topNoteName, topNoteOctave);
    });
    bottomButton.addEventListener("click", function() {
        tones.play(bottomNoteName, bottomNoteOctave);
    });
    bothButton.addEventListener("click", function() {
        tones.play(topNoteName, topNoteOctave);
        tones.play(bottomNoteName, bottomNoteOctave);
    });
    answers = document.getElementsByClassName("interval-button");
    for(var i = 0; i < answers.length; i++){
        answers[i].addEventListener("click", checkAnswer);
    }
    next.addEventListener("click", nextExercise);

    tones.type = "sine";
    tones.release = 200;
}

function getExercise(){
    var request = new XMLHttpRequest();
    request.onload = newExercise;
    request.open("GET", "/ear_training_app/get_interval_set", true);
    request.send();
}

document.addEventListener("DOMContentLoaded", getExercise);
