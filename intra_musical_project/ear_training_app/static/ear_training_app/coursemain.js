/*jslint browser: true, devel: true, todo: true */
/*global helpers, intramusical, tones */
//namespace for globals
var IM = {
    userLoggedIn: null,
    course: null
};

function initCourseWithData(responseData) {
    "use strict";
    helpers.assert(responseData !== undefined);
// for all users:
    // create the course
    // populate exercises
        // authenticated users get potentially different data from Django
        // anonymous users always get a random sample of intervals
    // create buttons / eventListeners
    // display exercise results
    // show course complete dialogue
    // var data = helpers.cloneObject(responseData);
    // console.log("data: ", data);
    // TODO: eliminate globals
    IM.userLoggedIn = responseData.userAuthenticated;
    helpers.assert(responseData.exercises.length > 0, "responseData.exercises has length zero");
    IM.course = intramusical.createCourse(responseData.exercises);
    IM.course.nameSet = helpers.getCheckedNames();
    // console.log(IM.course.nameSet);
    setupUserInterface();
}

function getCourseExercises() {
    "use strict";
    var data,
        request,
        checkedIds = helpers.getCheckedNames();
    //FIXME: instead of alert, disable button until two intervals are selected
    if (checkedIds.length < 2) {
        alert('You must choose at least two intervals');
        return false;
    }
    request = new XMLHttpRequest();
    request.onload = function () {
        var response = JSON.parse(this.responseText);
        initCourseWithData(response.data);
    };
    data = new FormData();
    data.append('html_names', checkedIds);
    request.open('POST', '/interval-selection/', true);
    request.send(data);
    return true;
}



function getResult() {
    "use strict";
    // TODO: change alerts to custom error dialogues
    var selectedButton = document.getElementsByClassName("pushed-button")[0];
    if (selectedButton !== undefined) {
        if (selectedButton.textContent === IM.course.currentExercise().interval.name) {
            alert("correct");
            return "correct";
        }
        else {
            alert("incorrect");
            return "incorrect";
        }
    }
    else { // no answer given, default to skipped
        return "skipped";
    }
}


function saveResult(result) {
    "use strict";
    var formData, responseData, request;
    formData = new FormData();
    request = new XMLHttpRequest();
    request.onload = function () {
        responseData = JSON.parse(this.responseText);
    };
    request.open('POST', '/courses/intervals/exercises/save-student-exercise/');
    formData.append("exercise_id", IM.course.currentExercise().exerciseId);
    formData.append("result", result);
    request.send(formData);
}

function updateUserInterface() {
    "use strict";
    var answerButtons = document.getElementsByClassName("answer-button");
    updateAnswerButtons(answerButtons);
    resetStyles(answerButtons);
    updateProgressCounter();
}

function goToNextExercise() {
    "use strict";
    var result;
        result = getResult(); // also shows result
        if (IM.userLoggedIn) {
            saveResult(result);
            IM.course.markCurrentExercise(result);
        }
        else {
            IM.course.markCurrentExercise(); // default to "skipped" for anonymous users
        }
        // last exercise
        if(IM.course.exercises.incomplete.length === 1) {
            document.getElementById("save").textContent = "Get Results";
        }
        if (IM.course.courseComplete()) {
            hideExerciseContent();
            showCourseCompleteDialogue();
        }
    updateUserInterface();
}

function resetStyles(answerButtons) {
    "use strict";
    //reset styles that have changed
    var i,
        result = document.getElementById("answer-result");
    result.textContent = "";
    for (i = 0; i < answerButtons.length; i += 1) {
        if (answerButtons[i].classList.contains("pushed-button")) {
            answerButtons[i].classList.remove("pushed-button");
        }
    }
}


function initProgressCounter(curr, total) {
    "use strict";
    var numExercises = IM.course.exercises.incomplete.length;
    total.innerHTML = numExercises;
    curr.innerHTML = 1;
}


function updateProgressCounter() {
    "use strict";
    var current, currentCount, totalExercises, totalExercisesCount;
    current = document.getElementById("current");
    currentCount = parseInt(current.innerHTML, 10);
    totalExercises = document.getElementById("course-total");
    totalExercisesCount = parseInt(totalExercises.innerHTML, 10);

    if (totalExercises.innerHTML === "") {
        initProgressCounter(current, totalExercises);
        return;
    }

    if (currentCount < totalExercisesCount) {
        current.innerHTML = currentCount + 1;
    }
}

function playTopNote() {
    "use strict";
    var topNote = IM.course.currentExercise().interval.topNote;
    // console.log("topNote: ", topNote);
    tones.play(topNote.letterName, topNote.octave);
}

function playBottomNote() {
    "use strict";
    var bottomNote = IM.course.currentExercise().interval.bottomNote;
    // console.log("bottomNote: ", bottomNote);
    tones.play(bottomNote.letterName, bottomNote.octave);
}

function setupSaveButtonListener() {
    "use strict";
    var save = document.getElementById("save");
    save.addEventListener("click", goToNextExercise);
}


function setupPlayButtonListeners() {
    "use strict";
    var topButton = document.getElementById("top-note-button");
    var bottomButton = document.getElementById("bottom-note-button");
    var bothButton = document.getElementById("both-notes-button");
    topButton.addEventListener("click", playTopNote);
    bottomButton.addEventListener("click", playBottomNote);
    bothButton.addEventListener("click", function playBothNotes() {
        playTopNote();
        setTimeout(function () {
            playBottomNote();
        }, 200);
    });
}

function markButtonPushed(event) {
    var answerButtons = document.getElementsByClassName("answer-button");
    for (var i = 0; i < answerButtons.length; i++) {
        if(answerButtons[i].classList.contains("pushed-button")) {
            answerButtons[i].classList.remove("pushed-button");
        }
    }
    event.target.classList.add("pushed-button");
}


function setupAnswerButtonListeners() {
    "use strict";
    var i, answers = document.getElementsByClassName("answer-button");
    for (i = 0; i < answers.length; i++) {
        answers[i].addEventListener("click", markButtonPushed);
    }
}


function setupUserInterface() {
    "use strict";
    var numButtons = Math.min(IM.course.nameSet.length, 4);
    updateAnswerButtons(createAnswerButtons(numButtons));
    setupSaveButtonListener();
    setupPlayButtonListeners();
    setupAnswerButtonListeners();
    updateProgressCounter();
}

function confirmIntervalSelectionDialogue() {
    "use strict";
    if (getCourseExercises()) {
        hideIntervalSelectionDialogue();
        showExerciseContent();
        document.getElementById("course-progress").classList.remove("hidden");
    }
}

function updateAnswerButtons(answerButtons) {
    "use strict";
    var correctAnswer, options, incorrectAnswers, numButtons, i;
    correctAnswer = IM.course.currentExercise().interval.name;
    numButtons = answerButtons.length;
    // sample from nameSet with intervalAnswer excluded
    var incorrectNames = _.without(IM.course.nameSet, correctAnswer);
    helpers.assert(IM.course.nameSet.length === incorrectNames.length + 1);
    incorrectAnswers = _.sample(incorrectNames, numButtons);
    helpers.assert(!_.contains(incorrectAnswers, correctAnswer));
    // make a shuffled list of all options
    options = _.shuffle(incorrectAnswers.concat([correctAnswer]));
    // helpers.assert(options.length === 4);
    // get the buttons
    if (numButtons === 0) { throw new Error("no buttons"); }
    // update button text with options
    for (i = 0; i < numButtons; i += 1) {
        answerButtons[i].textContent = options[i];
    }
}

function createAnswerButtons(numButtonLimit) {
    "use strict";
    var i, newButton,
    answerButtonContainer = document.getElementById("answer-button-container"),
    answerButtons = document.getElementsByClassName("answer-button");
    helpers.assert(answerButtonContainer);
    helpers.assert(answerButtons.length === 1);
    for (i = 1; i < numButtonLimit; i++) {
        newButton = answerButtons[0].cloneNode(false);
        answerButtonContainer.appendChild(newButton);
    }
    return answerButtons;
}





function init() {
    "use strict";
    //show interval selection dialogue
    document.getElementById("build-course-button").addEventListener("click", confirmIntervalSelectionDialogue);
    showIntervalSelectionDialogue(); // call to getCourseExercises()
}

document.addEventListener("DOMContentLoaded", init);
