//re-structuring course.js to use object-oriented JS

var intramusical = (function () {
    "use strict";
    /*
      letterNames will be useful for checking for valid letter
      names when creating Note objects
      var letterNames = ["A", "B", "C", "D", "E", "F", "G"];
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
            id:integer - unique id of the exercise from Django
            topNote:Note()
            bottomNote:Note()
            returns: Exercise object
        */
        Exercise: function (id, topNote, bottomNote) {
            //FIXME: add error checking

            var exercise = {};
            exercise.id = id;
            exercise.topNote = topNote;
            exercise.bottomNote = bottomNote;
            exercise.answerGiven = false;
            return exercise;
        },
        /*
            params:
            studentId:integer - unique id of the student from Django
            exercises:[Exercise] - a list of Exercise objects
        */
        //FIXME: add more error checking
        Course: function (studentId, exercises) {
            if (!Array.isArray(exercises)) {
                console.log("ERROR: exercises should be an Array");
            }
            else if (isEmptyArray(exercises)) {

            }
            else {
                var course = new Object();
                course.studentId = studentId;
                course.exercises = {
                    complete: exercises,
                    incomplete: []
                // }
            }
        }
}());

var note = intramusical.Note("A", 4);
document.getElementById("result").innerHTML = note.letterName + " " + note.octave;

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
