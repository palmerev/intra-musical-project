//needs tones.js

//namespace for interval and note data
var EP = {
    currentExercise: {
        id: 0,
        answerGiven: false,
        intervalName: "",
        topNoteName: "",
        topNoteOctave: 0,
        bottomNoteName: "",
        bottomNoteOctave: 0,
    },
    course: {
        allExercises: [],
        remainingExercises: [],
        //total number of exercises in course
        numExercises: function() {
            return EP.course.allExercises.length;
        },
        //number of exercises that the student(user) has touched (Django StudentExercise object created for each)
        studentExercises: [],
        numStudentExercises: function() {
            return EP.course.studentExercises.length;
        }
    }
}

function randIndex(length) {
    num = Math.floor(Math.random() * length);
    return num;
}

function showCourseResultsDialogue() {
  //in dialogue.js
  showDialogue();
}

function saveResult (event) {
    var formdata = new FormData();
    var responseData;
    var request = new XMLHttpRequest();
    request.onload = function () {
        responseData = JSON.parse(this.responseText);
        if (EP.currentExercise.answerGiven) {
            showResult(event);
        }
        apiAllStudentExercises();
    }
    request.open('POST', '/courses/intervals/exercises/save-student-exercise/');


    formdata.append("exercise_id", EP.currentExercise.id);
    if (EP.currentExercise.answerGiven) {
        if(event.target.innerHTML === EP.currentExercise.intervalName) {
            formdata.append("result", "correct");
            EP.answerResult = "correct";
        }
        else {
            formdata.append("result", "incorrect");
            EP.answerResult = "incorrect";
        }
    }
    else {
        formdata.append("result", "skipped");
        EP.answerResult = "skipped";
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

function getCourseExercises() {
    var request = new XMLHttpRequest();
    request.onload = makeExercisesFromData;
    request.open("GET", "/get-course-exercises/intervals", true);
    request.send()
    apiAllStudentExercises();
}

function initProgressCounter(curr, total) {
  //number of exercises (keys) in the course data object + current exercise
  var numExercises = Object.keys(EP.course.exercises).length + 1;
  total.innerHTML = numExercises;
  curr.innerHTML = 1;
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
    else if (EP.currentExercise.answerGiven){
      alert("Course Complete");
      // showCourseResultsDialogue();
    }
}

function makeExercisesFromData() {
  if(this.responseText) {
      EP.course.exercises = JSON.parse(this.responseText);
      EP.course.numExercises = EP.course.exercises.length;
  }
  else {
      console.log("No JSON data");
      return false;
  }
  setRandomIntervalExercise();
  createAnswerButtons(4); //param: number of buttons to create
  resetStylesAndSound();
  setupListeners();
  updateProgressCounter();
}

function setRandomIntervalExercise() {
  /*
  selects a random exercise from the array of exercises and assigns values
  for the next exercise, then removes that exercise from the array
  */
  EP.currentExercise.answerGiven = false;
  if (EP.course.exercises.length > 0) {
      EP.currentExercise.answerIndex = randIndex(EP.course.exercises.length);
      var curr = EP.course.exercises[EP.currentExercise.answerIndex];
      EP.currentExercise.id = curr.id;
      EP.currentExercise.intervalName = curr.interval_name;
      EP.currentExercise.topNoteName = curr.top_note.name;
      EP.currentExercise.topNoteOctave = parseInt(curr.top_note.octave);
      EP.currentExercise.bottomNoteName = curr.bottom_note.name;
      EP.currentExercise.bottomNoteOctave = parseInt(curr.bottom_note.octave);
  }
  else {
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
          // if (answerBtns[i].classList.contains("pushed-button")){
          //     answerBtns[i].classList.remove("pushed-button");
          // }
      }
      //set sound quality
      tones.type = "sine";
      tones.release = 150;
}

//TODO: only works for intervals
function createAnswerButtons(numButtonLimit) {
  var answerBtns = document.getElementsByClassName("answer-button");
  var templateAnswerBtn = answerBtns[0];
  templateAnswerBtn.innerHTML = EP.course.exercises[EP.currentExercise.answerIndex]["interval_name"];
  //create / clone others
  var answerBtnContainer = document.getElementById("answer-button-container");
  for (var i = 1; i < numButtonLimit; i++) {
      if (i != EP.currentExercise.answerIndex) {
          var newBtn = templateAnswerBtn.cloneNode(false);
          answerBtnContainer.appendChild(newBtn);
          answerBtns[i].innerHTML = EP.course.exercises[i]["interval_name"];
      }
  }
  EP.course.exercises.splice(EP.currentExercise.answerIndex, 1);
}

function doAnswer(event) {
    EP.currentExercise.answerGiven = true;
    saveResult(event);
}

function apiAllStudentExercises() {
    var request = new XMLHttpRequest();
    request.onload = function (e) {
        var se = JSON.parse(e.target.responseText);
        console.log(se);
        EP.course.numStudentExercises = se.length;
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
    if(EP.course.numStudentExercises > EP.course.numExercises) {
        alert("error: numStudentExercises greater than numExercises!");
    }
    if(EP.course.numStudentExercises === EP.course.numExercises) {
        showCourseResultsDialogue();
    }
    if(!EP.currentExercise.answerGiven) {
        saveResult(e);
    }
    setRandomIntervalExercise();
    resetStylesAndSound();
    updateProgressCounter();
}

function setupListeners() {
    setupPlayButtonListeners();
    setupNextButtonListener();
}

document.addEventListener("DOMContentLoaded", getCourseExercises);
