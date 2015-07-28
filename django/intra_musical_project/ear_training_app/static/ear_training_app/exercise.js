//needs tones.js, var intervalSetObject
// function playTopNote(){
//     tones.play("C#", 5);
// }
//
// function playBottomNote(){
//     tones.play("A", 4);
// }
//
// function playBothNotes(){
//     tones.play("C#", 5);
//     tones.play("A", 4);
// }
//
// function playNote(noteName, octave){
//     tones.play(noteName, octave);
// }
//
// function playTwoNotes(noteName1, octave1, noteName2, octave2){
//     tones.play(noteName1, octave1);
//     tones.play(noteName2, octave2);
// }

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
function init() {
    var topButton = document.getElementById("top-note-button");
    var bottomButton = document.getElementById("bottom-note-button");
    var bothButton = document.getElementById("both-notes-button");

    for(var i = 0; i < intervalSetObject.length; i++) {
        var curr = intervalSetObject[i];
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

    tones.type = "sine";
    tones.release = 200;
}

document.addEventListener("DOMContentLoaded", init);
