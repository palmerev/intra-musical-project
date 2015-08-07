//needs tones.js

// function makeAnswerButtons(intervals) {
//     //TODO: separate creation of buttons from adding/changing their innerHTML
//     var AnswerBtns = document.getElementsByClassName("answer-button");
//     var numBtns = AnswerBtns.length;
//     if (numBtns <= 0) {
//         return false;
//     }
//     //create / clone other buttons if there are fewer buttons than options
//     answerBtnContainer = document.getElementById("answer-button-container");
//     for (var i = 0; i < intervals.length - numBtns; i++) {
//         var newBtn = AnswerBtns[0].cloneNode(false);
//         answerBtnContainer.appendChild(newBtn);
//     }
//     //else buttons already there, skip creation step
//     var numBtns = AnswerBtns.length;
//     if (numBtns !== intervals.length) {
//         return false;
//     }
//     for (var i = 0; i < numBtns; i++) {
//           var currInterval = intervals[i];
//         var currBtn = AnswerBtns[i];
//         currBtn.innerHTML = currInterval["interval_name"];
//     }
// }
//
// function setupListeners() {
//     var topButton = document.getElementById("top-note-button");
//     var bottomButton = document.getElementById("bottom-note-button");
//     var bothButton = document.getElementById("both-notes-button");
//
//     //global variables update each time a new exercise is generated
//     topButton.addEventListener("click", function() {
//         // console.log("playing note " + topNoteName + " " + topNoteOctave.toString());
//         tones.play(EP.topNoteName, EP.topNoteOctave);
//     });
//     bottomButton.addEventListener("click", function() {
//         tones.play(EP.bottomNoteName, EP.bottomNoteOctave);
//     });
//     bothButton.addEventListener("click", function() {
//         tones.play(EP.topNoteName, EP.topNoteOctave);
//         setTimeout(function(){
//             tones.play(EP.bottomNoteName, EP.bottomNoteOctave);
//         }, 200);
//
//     });
//     var answers = document.getElementsByClassName("answer-button");
//     for(var i = 0; i < answers.length; i++){
//         answers[i].addEventListener("click", showResult);
//         answers[i].addEventListener("click", recordAnswer);
//     }
//
//     var next = document.getElementById("next");
//     next.addEventListener("click", getExercise);
// }
//
// function newExercise() {
//     if(this.responseText) {
//         //console.log(this.responseText);
//         EP.intervalSet = JSON.parse(this.responseText);
//     }
//     else {
//         console.log("No JSON data");
//         console.log(this.responseText);
//     }
//     var answerIndex = randIndex(EP.intervalSet.length);
//     //choose a random interval to play
//     var curr = EP.intervalSet[answerIndex];
//     EP.intervalName = curr.interval_name;
//     EP.topNoteName = curr.top_note.name;
//     EP.topNoteOctave = parseInt(curr.top_note.octave);
//     EP.bottomNoteName = curr.bottom_note.name;
//     EP.bottomNoteOctave = parseInt(curr.bottom_note.octave);
//
//     //reset to normal styles
//     var result = document.getElementById("answer-result");
//     result.innerHTML = "";
//     var next = document.getElementById("next");
//     next.style.fontSize = "1em";
//     //set sound quality
//     tones.type = "sine";
//     tones.release = 150;
//
//     makeAnswerButtons(EP.intervalSet);
//     setupListeners();
// }
//
// function getExercise(){
//     var request = new XMLHttpRequest();
//     request.onload = newExercise;
//     request.open("GET", "/get-interval-set/", true);
//     request.send();
// }
//
// document.addEventListener("DOMContentLoaded", getExercise);
