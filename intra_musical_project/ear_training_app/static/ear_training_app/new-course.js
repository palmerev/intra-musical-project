//re-structuring course.js to use object-oriented JS

var intramusical = (function () {
    'use strict';
    /*
      letterNames will be useful for checking for valid letter
      names when creating Note objects
      var letterNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    */
    return {
        /*
            params:
            letterName:string
            octave:integer
            returns: Note object
        */
        Note: function (letterName, octave) {
            var note = {};
            note.letterName = letterName;
            note.octave = octave;
            return note;
        },
        /*
            params:
            intervalId:integer - unique id of the interval from Django
            topNote:Note object
            bottomNote:Note object
            intervalName:string
        */
        Interval: function (intervalId, topNote, BottomNote, intervalName) {
            var interval = {};
            interval.intervalId = intervalId;
            interval.topNote = topNote;
            interval.bottomNote = bottomNote;
            interval.name = name;
            return interval;
        }
        /*
            params:
            exerciseId:integer - unique id of the exercise from Django
            interval:Interval object
            returns: Exercise object
        */
        IntervalExercise: function (exerciseId, interval) {
            //FIXME: add error checking
            var exercise = {};
            exercise.exerciseId = exerciseId;
            exercise.interval: {
                topNote: interval.topNote;
                bottomNote: interval.bottomNote;
            }
            exercise.answer = "skipped";
            return exercise;
        }
        /*
            params:
            studentId:integer - unique id of the student from Django
            exercises:[Exercise] - a list of Exercise objects
        */
        //FIXME: add more error checking
        Course: function (studentId, exercises) {
            if (!Array.isArray(exercises)) {
                console.log('ERROR: exercises should be an Array');
            } else if (isEmptyArray(exercises)) {
                return;
            } else {
                var course = new Object();
                course.studentId = studentId;
                course.exercises = {
                    complete: [],
                    incomplete: exercises
                }
            }
        }
}());

// var note = intramusical.Note('A', 4);
// document.getElementById('result').innerHTML = note.letterName + ' ' + note.octave;
function makeExercisesFromData(data) {
    var numButtons = Math.min(data.length, 4);
    // console.log('numButtons:' + numButtons);
    if(data) {
    // initialize a bunch of Exercises with data
    //
    }
    else {
        // console.log('No JSON data');
        return false;
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
    
}
