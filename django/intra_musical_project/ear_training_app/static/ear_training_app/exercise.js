//needs tones.js

//namespace for interval and note data
var EP = {}

function randIndex(length) {
    num = Math.floor(Math.random() * length);
    return num;
}

function recordAnswer(event){
    console.log(event.target.innerHTML);
    // result = document.getElementById("answer-result");
    // correctAnswer = document.getElementById("correct-answer");
    var data = new FormData()
    var request = new XMLHttpRequest();
    request.open('post', '/courses/intervals/exercises/complete-exercise/');
    request.onload = function() {
        var data = JSON.parse(this.responseText);
        console.log(data);
    }
    if(event.target.innerHTML === EP.intervalName) {
        data.append("result", "correct");
    }
    else{
        data.append("result", "incorrect");
    }
    request.send(data);
}

function showResult(event){
    console.log(event.target.innerHTML);
    result = document.getElementById("answer-result");
    correctAnswer = document.getElementById("correct-answer");
    if(result.innerHTML === ""){
        if (event.target.innerHTML === EP.intervalName) {
            result.style.color = "white";
            result.innerHTML = "Correct!";
        }
        else {
            result.style.color = "red";
            result.innerHTML = "Incorrect. It's a " + EP.intervalName + ".";
        }
    }
    var next = document.getElementById("next");
    var st = next.style;
    st.fontSize = "1.5em";
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
        tones.play(EP.topNoteName, EP.topNoteOctave);
    });
    bottomButton.addEventListener("click", function() {
        tones.play(EP.bottomNoteName, EP.bottomNoteOctave);
    });
    bothButton.addEventListener("click", function() {
        tones.play(EP.topNoteName, EP.topNoteOctave);
        setTimeout(function(){
            tones.play(EP.bottomNoteName, EP.bottomNoteOctave);
        }, 200);

    });
    var answers = document.getElementsByClassName("answer-button");
    for(var i = 0; i < answers.length; i++){
        answers[i].addEventListener("click", showResult);
        answers[i].addEventListener("click", recordAnswer);
    }

    var next = document.getElementById("next");
    next.addEventListener("click", getExercise);
}

function newExercise() {
    if(this.responseText) {
        console.log(this.responseText);
        EP.intervalSet = JSON.parse(this.responseText);
    }
    else {
        console.log("No JSON data");
        console.log(this.responseText);
    }
    var answerIndex = randIndex(EP.intervalSet.length);
    //choose a random interval to play
    var curr = EP.intervalSet[answerIndex];
    EP.intervalName = curr.interval_name;
    EP.topNoteName = curr.top_note.name;
    EP.topNoteOctave = parseInt(curr.top_note.octave);
    EP.bottomNoteName = curr.bottom_note.name;
    EP.bottomNoteOctave = parseInt(curr.bottom_note.octave);

    //reset to normal styles
    var result = document.getElementById("answer-result");
    result.innerHTML = "";
    var next = document.getElementById("next");
    next.style.fontSize = "1em";
    //set sound quality
    tones.type = "sine";
    tones.release = 150;

    makeAnswerButtons(EP.intervalSet);
    setupListeners();
}

function getExercise(){
    var request = new XMLHttpRequest();
    request.onload = newExercise;
    request.open("GET", "/get-interval-set/", true);
    request.send();
}

document.addEventListener("DOMContentLoaded", getExercise);
