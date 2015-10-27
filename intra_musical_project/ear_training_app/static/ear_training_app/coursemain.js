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

function init() {
    //get exercise data
    //create exercises
    //create course with exercises
}

document.addEventListener("DOMContentLoaded", init);
