// var note = intramusical.Note('A', 4);
// document.getElementById('result').innerHTML = note.letterName + ' ' + note.octave;
function makeExercisesFromData(data) {
    var numButtons = Math.min(data.length, 4);
    // console.log('numButtons:' + numButtons);
    if(studentCourse) {
    // initialize a bunch of Exercises with data
    }
    else {
        // console.log('No JSON data');
        throw "no studentCourse";
    }
    // apiAllStudentExercises();
    // setRandomIntervalExercise();
    // createAnswerButtons(numButtons);
    // updateAnswerButtonText();
    // resetStylesAndSound();
    // setupListeners();
    // updateProgressCounter();
}

function getCourseExercises() {
    var checkedIds = getIdsOfChecked();
    //FIXME: change alert to warning text in selection dialogue
    if (checkedIds.split(' ').length < 2) {
        alert('You must choose at least two intervals');
        return false;
    }
    var request = new XMLHttpRequest();
    request.onload = function() {
        // console.log('It worked!');
        var response = JSON.parse(this.responseText);
        // console.log(response);
        makeExercisesFromData(response.data);
    }
    var data = new FormData();
    data.append('html_names', checkedIds);
    request.open('POST', '/interval-selection/', true);
    request.send(data);
    return true;
}

function initProgressCounter(curr, total) {
    var numExercises = studentCourse.exercises.incomplete.length;
    total.innerHTML = numExercises;
    curr.innerHTML = 1;
}

function showSelectionDialogue() {
    // TODO: modify getCourseExercises to confirm selection and send selected names to Django
    var siGrayout = document.getElementById("si-grayout");
    var siDialogue = document.getElementById("si-dialogue");
    siGrayout.classList.remove("hidden");
    siDialogue.classList.remove("hidden");
    document.getElementById("build-course-button").addEventListener("click", confirmIntervalSelectionDialogue);
}

function confirmIntervalSelectionDialogue() {
    if(getCourseExercises()) {
        hideIntervalSelectionDialogue();
    }
}

function init() {
    //show interval selection dialogue
    //get exercise data
    //create exercises
    //create course with exercises
}

document.addEventListener("DOMContentLoaded", init);
