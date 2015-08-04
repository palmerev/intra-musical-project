//needs tones.js
function randIndex(length) {
    num = Math.floor(Math.random() * length);
    return num;
}

function showResult(event){
    console.log(event.target);
    result = document.getElementById("answer-result");
    correctAnswer = document.getElementById("correct-answer");
    if (event.target.innerHTML === window.intervalName) {
        result.style.color = "white";
        result.innerHTML = "Correct!";
    }
    else {
        result.style.color = "red";
        result.innerHTML = "Incorrect...";
    }
}

function makeAnswerButtons(intervals) {
    var AnswerBtns = document.getElementsByClassName("answer-button");
    var numBtns = AnswerBtns.length;
    if (numBtns <= 0) {
        return false;
    }
    //create / clone other buttons if there are fewer buttons than options
    answerBtnContainer = document.getElementById("answer-button-container");
    for (var i = 0; i < intervals.length - numBtns; i++) {
        var newBtn = AnswerBtns[0].cloneNode(false);
        answerBtnContainer.appendChild(newBtn);
    }
    //else buttons already there, skip creation step
    var numBtns = AnswerBtns.length;
    if (numBtns !== intervals.length) {
        return false;
    }
    for (var i = 0; i < numBtns; i++) {
        var currInterval = intervals[i];
        var currBtn = AnswerBtns[i];
        currBtn.innerHTML = currInterval["interval_name"];
    }
}

function setupListeners() {
    var topButton = document.getElementById("top-note-button");
    var bottomButton = document.getElementById("bottom-note-button");
    var bothButton = document.getElementById("both-notes-button");

    //global variables update each time a new exercise is generated
    topButton.addEventListener("click", function() {
        // console.log("playing note " + topNoteName + " " + topNoteOctave.toString());
        tones.play(window.topNoteName, window.topNoteOctave);
    });
    bottomButton.addEventListener("click", function() {
        tones.play(window.bottomNoteName, window.bottomNoteOctave);
    });
    bothButton.addEventListener("click", function() {
        tones.play(window.topNoteName, window.topNoteOctave);
        setTimeout(function(){
            tones.play(window.bottomNoteName, window.bottomNoteOctave);
        }, 200);

    });
    var answers = document.getElementsByClassName("answer-button");
    console.log(answers.length);
    for(var i = 0; i < answers.length; i++){
        answers[i].addEventListener("click", showResult);
    }

    tones.type = "sine";
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
    var answerIndex = randIndex(intervalSet.length);
    //choose a random interval to play
    var curr = intervalSet[answerIndex];
    window.intervalName = curr.interval_name;
    window.topNoteName = curr.top_note.name;
    window.topNoteOctave = parseInt(curr.top_note.octave);
    window.bottomNoteName = curr.bottom_note.name;
    window.bottomNoteOctave = parseInt(curr.bottom_note.octave);

    result = document.getElementById("answer-result");
    result.innerHTML = "";

    makeAnswerButtons(intervalSet);
    setupListeners();
}

function getExercise(){
    var request = new XMLHttpRequest();
    request.onload = newExercise;
    request.open("GET", "/get-interval-set/", true);
    request.send();
}

document.addEventListener("DOMContentLoaded", getExercise);
