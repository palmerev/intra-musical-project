//needs tones.js

function saveResult (event) {
    var formdata = new FormData();
    var responseData;
    var request = new XMLHttpRequest();
    request.onload = function () {
        responseData = JSON.parse(this.responseText);
        if (EP.currentExercise.answerGiven) {
            showResult(event);
        }
        apiAllStudentExercises(); //for debugging purposes and resuming course from previous point
    }
    request.open('POST', '/courses/intervals/exercises/save-student-exercise/');
    formdata.append("exercise_id", EP.currentExercise.id);
    if (EP.currentExercise.answerGiven) {
        if(event.target.innerHTML === EP.currentExercise.intervalName) {
            formdata.append("result", "correct");
        }
        else {
            formdata.append("result", "incorrect");
        }
    }
    else {
        formdata.append("result", "skipped");
    }
    request.send(formdata);
}

function showResult(event){
    //console.log(event.target.innerHTML);
    var result = document.getElementById("answer-result");
    var correctAnswer = document.getElementById("correct-answer");
    if(result.innerHTML === ""){
        // event.target.classList.add("pushed-button");
        var s = event.target.style;
        s.border = "3px solid yellow";
        s.background = "blue";
            if (event.target.innerHTML === EP.currentExercise.intervalName) {
            result.style.color = "blue";
            result.innerHTML = "Correct!";
        }
        else {
            result.style.color = "red";
            result.innerHTML = "Incorrect. It's a " + EP.currentExercise.intervalName + ".";
        }
    }
}


function makeExercisesFromData(data) {
    var numButtons = Math.min(data.length, 4);
    console.log("numButtons:" + numButtons);
    if(data) {
        EP.course.allExercises = data;
        EP.course.remainingExercises = EP.course.allExercises;
    }
    else {
        console.log("No JSON data");
        return false;
    }
    apiAllStudentExercises();
    setRandomIntervalExercise();
    createAnswerButtons(numButtons);
    updateAnswerButtonText();
    resetStylesAndSound();
    setupListeners();
    updateProgressCounter();
}


function updateProgressCounter() {
    var current = document.getElementById("current");
    var currentCount = parseInt(current.innerHTML);
    var totalExercises = document.getElementById("course-total");
    var totalExercisesCount = parseInt(totalExercises.innerHTML);

    if(totalExercises.innerHTML === "") {
        initProgressCounter(current, totalExercises);
        return;
    }

    if (currentCount < totalExercisesCount) {
        current.innerHTML = currentCount + 1;
    }
}

function setRandomIntervalExercise() {
    /*
    selects a random exercise from the array of exercises and assigns values
    for the next exercise, then removes that exercise from the array
    */
    console.log("setRandomIntervalExercise::EP.course.remainingExercises:");
    console.log(EP.course.remainingExercises);
    EP.currentExercise.answerGiven = false;
    if (EP.course.remainingExercises.length > 0) {
        var index = randIndex(EP.course.remainingExercises.length);
        var selected = EP.course.remainingExercises[index];
        EP.currentExercise.id = selected.id;
        EP.currentExercise.intervalName = selected.interval_name;
        EP.currentExercise.topNoteName = selected.top_note.name;
        EP.currentExercise.topNoteOctave = parseInt(selected.top_note.octave);
        EP.currentExercise.bottomNoteName = selected.bottom_note.name;
        EP.currentExercise.bottomNoteOctave = parseInt(selected.bottom_note.octave);
    }
    else {
        //should never happen...
        console.log("out of exercises!");
    }
}

function resetStylesAndSound() {
      //reset styles that have changed
      var result = document.getElementById("answer-result");
      result.innerHTML = "";
      var answerBtns = document.getElementsByClassName("answer-button");
      for (var i = 0; i < answerBtns.length; i++) {
          if (answerBtns[i].hasAttribute("style")) {
              // console.log(answerBtns[i].innerHTML);
              answerBtns[i].style.background = "linear-gradient(to bottom, #E38900, #C06600)";
              answerBtns[i].style.border = "none";
          }
          // This would be a better way. Keep CSS out of JS
          // if (answerBtns[i].classList.contains("pushed-button")){
          //     answerBtns[i].classList.remove("pushed-button");
          // }
      }
      //set sound quality
      tones.type = "sine";
      tones.release = 150;
}

function createAnswerButtons(numButtonLimit) {
    var answerBtns = document.getElementsByClassName("answer-button");
    var answerBtnContainer = document.getElementById("answer-button-container");
    for (var i = 1; i < numButtonLimit; i++) {
        var newBtn = answerBtns[0].cloneNode(false);
        answerBtnContainer.appendChild(newBtn);
    }
}

//TODO: add parameter for course name to make it more generic
function updateAnswerButtonText() {
    var exercises = EP.course.allExercises.slice();
    var answerBtns = document.getElementsByClassName("answer-button");
    var numButtons = answerBtns.length;
    var answerText = EP.currentExercise.intervalName;
    var answerIndex = getObjectIndexByProperty("interval_name", answerText, exercises);
    var correctAnswer = exercises.splice(answerIndex, 1)[0];
    var newOptions = [];
    var incorrectAnswers = randomSample(numButtons - 1, exercises);
    //add answer to list of new options
    newOptions = incorrectAnswers.concat([correctAnswer]);
    inPlaceShuffle(newOptions);
    for (var i = 0; i < answerBtns.length; i++) {
        var current = answerBtns[i];
        current.innerHTML = newOptions[i]["interval_name"];
    }
}

function doAnswer(event) {
    EP.currentExercise.answerGiven = true;
    saveResult(event);
}

function apiAllStudentExercises() {
    var request = new XMLHttpRequest();
    request.onload = function (e) {
        var se = JSON.parse(e.target.responseText);
        console.log("remainingExercises:");
        console.log(EP.course.remainingExercises);
        console.log("api student exercises: ");
        console.log(se);
        EP.course.studentExercises = se;
    }
    request.open("GET", "/api/all-student-exercises/", true);
    request.send();
}

function setupPlayButtonListeners() {
    var topButton = document.getElementById("top-note-button");
    var bottomButton = document.getElementById("bottom-note-button");
    var bothButton = document.getElementById("both-notes-button");
    //global variables update each time a new exercise is generated
    topButton.addEventListener("click", function() {
        tones.play(EP.currentExercise.topNoteName, EP.currentExercise.topNoteOctave);
    });
    bottomButton.addEventListener("click", function() {
        tones.play(EP.currentExercise.bottomNoteName, EP.currentExercise.bottomNoteOctave);
    });
    bothButton.addEventListener("click", function() {
        tones.play(EP.currentExercise.topNoteName, EP.currentExercise.topNoteOctave);
        setTimeout(function(){
            tones.play(EP.currentExercise.bottomNoteName, EP.currentExercise.bottomNoteOctave);
        }, 200);
    });
    var answers = document.getElementsByClassName("answer-button");
    for(var i = 0; i < answers.length; i++){
        answers[i].addEventListener("click", doAnswer);
    }
}

function setupNextButtonListener() {
    var next = document.getElementById("next");
    next.addEventListener("click", goToNextExercise);
}

function goToNextExercise(e) {
    if(EP.course.numStudentExercises() > EP.course.numExercises()) {
        alert("error: numStudentExercises greater than numExercises!");
    }
    if(EP.course.numStudentExercises() === EP.course.numExercises()) {
        showCourseResultsDialogue();
    }
    if(!EP.currentExercise.answerGiven) {
        saveResult(e);
    }
    setRandomIntervalExercise();
    updateAnswerButtonText();
    resetStylesAndSound();
    updateProgressCounter();
    //TODO: figure out where to put this. Maybe "goToNextExercise"?
    // EP.course.remainingExercises.splice(EP.currentExercise.answerIndex, 1);
    var answerIndex = getObjectIndexByProperty(
          "interval_name",
          EP.currentExercise.intervalName,
          EP.course.remainingExercises
    );
    EP.course.remainingExercises.splice(answerIndex, 1);
}

function setupListeners() {
    setupPlayButtonListeners();
    setupNextButtonListener();
}

function getCourseExercises() {
    var checkedIds = getIdsOfChecked();
    if (checkedIds.split(" ").length < 2) {
        alert("You must choose at least two intervals");
        return false;
    }
    var request = new XMLHttpRequest();
    request.onload = function() {
        console.log("It worked!");
        var text = JSON.parse(this.responseText);
        console.log(text);
        makeExercisesFromData(text.data);
    }
    var data = new FormData();
    data.append("html_names", checkedIds);
    request.open("POST", "/interval-selection/", true);
    request.send(data);
    return true;
}
document.addEventListener("DOMContentLoaded", showSelectionDialogue);
