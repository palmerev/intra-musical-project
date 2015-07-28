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

function newExercise() {
    var intervalSet = JSON.parse(this.responseText);
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

function nextExercise(){
    var request = new XMLHttpRequest();
    request.onload = newExercise;
    request.open("GET", "/ear_training_app/get_interval_set", true);
    request.send();
}

document.addEventListener("DOMContentLoaded", init);
