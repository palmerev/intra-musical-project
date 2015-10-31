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
            returns: IntervalExercise object, where answer == "skipped";
        */
        IntervalExercise: function (exerciseId, interval) {
            //TODO: add error checking
            var exercise = {};
            exercise.exerciseId = exerciseId;
            exercise.interval: {
                topNote: interval.topNote;
                bottomNote: interval.bottomNote;
                intervalId: interval.intervalId;
                name: interval.name;
            }
            exercise.answer = "skipped";
            return exercise;
        }
        /*
            params:
            studentId:integer - unique id of the student from Django
            exercises:[Exercise] - a list of Exercise objects
        */
        //TODO: add more error checking
        Course: function (studentId, exercisesArray) {
            if (!Array.isArray(exercisesArray)) {
                console.log('ERROR: exercises should be an Array');
            } else if (isEmptyArray(exercisesArray)) {
                return;
            } else {
                var course = Object.create(null);
                course.studentId = studentId;
                course.exercises = {
                    complete: [],
                    incomplete: exercisesArray
                }
                //TODO: test this!
                Course.prototype.markCurrentExerciseCompleted = function (result) {
                    console.log("untested method");
                    if (this.exercises.incomplete.length > 0) {
                        var currentExercise = this.exercises.incomplete.splice(0, 1)[0];
                    }
                    if (!currentExercise) {
                      throw "couldn't get current incomplete exercise";
                    }
                    currentExercise.answer = result || currentExercise.answer;
                    this.exercises.complete.push(currentExercise);
                }
                //TODO: test this!
                Course.prototype.checkCourseComplete = function () {
                    console.log("untested method");
                    return (this.exercises.incomplete.length == 0);
                }
              }
            }
        }
}());
