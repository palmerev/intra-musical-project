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
    IM.userLoggedIn = responseData.userAuthenticated;
    helpers.assert(responseData.exercises.length > 0, "responseData.exercises has length zero");
    IM.course = intramusical.createCourse(responseData.exercises);
    IM.course.nameSet = helpers.getCheckedNames();
    setupUserInterface();
}

function getCourseExercises() {
    "use strict";
    var data,
        request,
        checkedIds = helpers.getCheckedNames();
    // should never happen
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
    var selectedButton = document.getElementsByClassName("pushed-answer-button")[0];
    if (selectedButton !== undefined) {
        var answer = IM.course.currentExercise().interval.name;
        if (selectedButton.textContent === answer) {
            showAnswerDialogue("correct", answer);
            return "correct";
        }
        else {
            showAnswerDialogue("incorrect", answer);
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
        // TODO: confirm success response
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

//TODO: move this to answer button click handler
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
        result = document.getElementById("answer-result"),
        saveButton = document.getElementById("save");
    saveButton.innerText = "Skip";
    result.innerText = "";
    for (i = 0; i < answerButtons.length; i += 1) {
        if (answerButtons[i].classList.contains("pushed-answer-button")) {
            answerButtons[i].classList.remove("pushed-answer-button");
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
    tones.play(topNote.letterName, topNote.octave);
}

function playBottomNote() {
    "use strict";
    var bottomNote = IM.course.currentExercise().interval.bottomNote;
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
    var answerButtons = document.getElementsByClassName("answer-button"),
        saveButton = document.getElementById("save");
    // clear all previously pushed buttons
    for (var i = 0; i < answerButtons.length; i++) {
        if(answerButtons[i].classList.contains("pushed-answer-button")) {
            answerButtons[i].classList.remove("pushed-answer-button");
        }
    }
    event.target.classList.add("pushed-answer-button");
    saveButton.innerText = "Next";
}


function setupAnswerButtonListeners() {
    "use strict";
    var i, answers = document.getElementsByClassName("answer-button");
    for (i = 0; i < answers.length; i++) {
        answers[i].addEventListener("click",
        function() {
            var result = getResult(); // also shows result
            markButtonPushed();
            saveResult(result);
        });
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
        // show the progess counter
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
    answerButtonContainer = document.getElementById("answer-button-container");
    for (i = 0; i < numButtonLimit; i++) {
        newButton = document.createElement('button');
        newButton.classList.add('answer-button');
        answerButtonContainer.appendChild(newButton);
    }
    return document.getElementsByClassName('answer-button');
}





function init() {
    "use strict";
    //show interval selection dialogue
    document.getElementById("build-course-button").addEventListener("click", confirmIntervalSelectionDialogue);
    showIntervalSelectionDialogue(); // call to getCourseExercises()
}

document.addEventListener("DOMContentLoaded", init);
