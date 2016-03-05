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
        checkedIds = helpers.getCheckedNames(),
        lengthId = helpers.getCourseLength(),
        len;
    // should never happen
    if (checkedIds.length < 2) {
        alert('You must choose at least two intervals');
        return false;
    }
    if (lengthId === "short") {
        len = 6;
    }
    else if (lengthId === "long") {
        len = 12;
    }
    else {
        throw new Error("bad course length!");
    }
    request = new XMLHttpRequest();
    request.onload = function () {
        var response = JSON.parse(this.responseText);
        initCourseWithData(response.data);
    };
    data = new FormData();
    data.append('html_names', checkedIds);
    data.append('course_length', len);
    request.open('POST', '/interval-selection/', true);
    request.send(data);
    return true;
}

function getResult() {
    "use strict";
    var selectedButton = document.getElementsByClassName("pushed-answer-button")[0],
        answer,
        result;
    if (selectedButton !== undefined) {
        answer = IM.course.currentExercise().interval.name;
        result = selectedButton.textContent === answer ? "correct" : "incorrect";
    }
    else { // no answer given, default to skipped
        result = "skipped";
    }

    return result;
}


function saveResult(result) {
    "use strict";
    var answer = IM.course.currentExercise().interval.name,
        nextButton = document.getElementById("next-btn"),
        formData = new FormData(),
        request = new XMLHttpRequest();
    request.onload = function () {
        // TODO: confirm success response
        if (this.status === 200) {
            showAnswerDialogue(result, answer);
        }
        else {
            var resultElem = document.getElementById("answer-result");
            resultElem.textContent = "Error saving answer.";
        }
        helpers.enable(nextButton);
    };
    request.open('POST', '/courses/intervals/exercises/save-student-exercise/');
    formData.append("exercise_id", IM.course.currentExercise().exerciseId);
    formData.append("result", result);
    request.send(formData);
}


function playTopNote() {
    "use strict";
    var topNote = IM.course.currentExercise().interval.topNote,
        noteName = [topNote.letterName, topNote.octave.toString()].join(""),
        //create one of Tone's built-in synthesizers and connect it to the master output
        synth = new Tone.SimpleSynth().toMaster();
    //play the note for the duration of a quarter note
    synth.triggerAttackRelease(noteName, "4n");
}

function playBottomNote() {
    "use strict";
    var bottomNote = IM.course.currentExercise().interval.bottomNote,
        noteName = [bottomNote.letterName, bottomNote.octave.toString()].join(""),
        //create one of Tone's built-in synthesizers and connect it to the master output
        synth = new Tone.SimpleSynth().toMaster();
    //play the note for the duration of a quarter note
    synth.triggerAttackRelease(noteName, "4n");
}

// click handler for next-btn
function goToNext(event) {
    "use strict";
    var result, resultElem, answerButtons, showAnswerButton, nextButton;
    if (IM.course.courseComplete()) {
        hideExerciseContent();
        showCourseCompleteDialogue();
    }
    else {
        resultElem = document.getElementById("answer-result");
        answerButtons = document.getElementsByClassName("answer-button");
        showAnswerButton = document.getElementById("show-answer-btn");
        nextButton = document.getElementById("next-btn");
        resultElem.textContent = ""; // clear/hide result
        updateProgressCounter(); // update progress counter
        updateAnswerButtons(answerButtons); // clear answer buttons
        helpers.enable(showAnswerButton);
        helpers.disable(nextButton);
    }
}

// click handler for answer-button(s) and show-answer-btn
function processAnswer (event) {
    "use strict";
    var result,
        showAnswerButton;
    markButtonPushed(event);
    result = getResult();
    saveResult(result); // currently displays answer result
    IM.course.markCurrentExercise(result); // load next exercise
    if(event.target.id === "show-answer-btn") {
        showAnswerButton = event.target;
    }
    else {
        showAnswerButton = document.getElementById("show-answer-btn");
    }
    // TODO: add CSS for .disabled
    helpers.disable(showAnswerButton);
}

function markButtonPushed(event) {
    "use strict";
    var i,
        answerButtons = document.getElementsByClassName("answer-button");
    // clear all previously pushed buttons
    for (i = 0; i < answerButtons.length; i++) {
        if(answerButtons[i].classList.contains("pushed-answer-button")) {
            answerButtons[i].classList.remove("pushed-answer-button");
        }
        // an answer was already given, so disable the buttons for now
        helpers.disable(answerButtons[i]);
    }
    if (event.target.id !== "show-answer-btn") {
        event.target.classList.add("pushed-answer-button");
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

function setupShowAndNextButtons() {
    "use strict";
    var showBtn = document.getElementById("show-answer-btn"),
        nextBtn = document.getElementById("next-btn");
    showBtn.addEventListener("click", processAnswer);
    nextBtn.addEventListener("click", goToNext);
    helpers.disable(nextBtn);
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

function setupAnswerButtonListeners() {
    "use strict";
    var i, answers = document.getElementsByClassName("answer-button");
    for (i = 0; i < answers.length; i++) {
        answers[i].addEventListener("click", processAnswer);
    }
}

function setupUserInterface() {
    "use strict";
    var numButtons = Math.min(IM.course.nameSet.length, 4);
    updateAnswerButtons(createAnswerButtons(numButtons));
    setupShowAndNextButtons();
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

function resetAnswerButtons(answerButtons) {
    "use strict";
    var i;
    for (i = 0; i < answerButtons.length; i += 1) {
        if (answerButtons[i].classList.contains("pushed-answer-button")) {
            answerButtons[i].classList.remove("pushed-answer-button");
        }
        helpers.enable(answerButtons[i]);
    }
}

function updateAnswerButtons(answerButtons) {
    "use strict";
    var options, incorrectAnswers, i,
    correctAnswer = IM.course.currentExercise().interval.name,
    numButtons = answerButtons.length,
    // sample from nameSet with intervalAnswer excluded
    incorrectNames = _.without(IM.course.nameSet, correctAnswer);
    resetAnswerButtons(answerButtons);
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
