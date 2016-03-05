/*jslint browser: true, devel: true, todo: true */
/*global helpers, _ */

var intramusical = (function () {
    'use strict';
    // TODO: create base object Exercise for IntervalExercise, etc. to inherit from,
    // or let Exercise take an arbitrary object.
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
            returns:
            Note object
        */
        createNote: function (letterName, octave) {
            var note = Object.create(null);
            note.letterName = letterName;
            note.octave = octave;
            // console.log("in createNote: ", note);
            return note;
        },
        /*
            params:
            topNote:Note object
            bottomNote:Note object
            intervalName:string
        */
        createInterval: function (topNote, bottomNote, intervalName) {
            var interval = Object.create(null);
            interval.topNote = topNote;
            interval.bottomNote = bottomNote;
            interval.name = intervalName;
            // console.log("inside createInterval: ", interval);
            return interval;
        },
        /*
            params:
            exerciseId:integer - unique id of the exercise from Django
            interval:Interval object
            returns:
            IntervalExercise object, where answer == "skipped";
        */
        createIntervalExercise: function (interval, exerciseId) {
            //TODO: add error checking
            var exercise = Object.create(null);
            exercise.exerciseId = exerciseId;
            exercise.interval = {
                topNote: interval.topNote,
                bottomNote: interval.bottomNote,
                name: interval.name
            };
            exercise.answer = "skipped";
            return exercise;
        },
        /*
            params:
            studentId:integer - unique id of the student from Django
            exercisesArray:[Exercise] - a list of Exercise objects
        */
        //TODO: add more error checking
        createCourse: function (exercisesArray) {
            helpers.assert(exercisesArray !== undefined);
            var course,
                exercises = exercisesArray.slice(),
                courseExercises = [];
            var i, ex, courseExercise, note, exercise;
            if (!Array.isArray(exercises)) {
                throw 'ERROR: exercises should be an Array';
            }
            else if (helpers.isEmptyArray(exercises)) {
                return null;
            }
            else {
                for (i = 0; i < exercises.length; i++) {
                    ex = exercises[i];
                    // build exercise
                    courseExercise = this.createIntervalExercise(
                        this.createInterval(
                            this.createNote(ex.topNote.letterName, ex.topNote.octave),
                            this.createNote(ex.bottomNote.letterName, ex.bottomNote.octave),
                            ex.intervalName
                        ),
                        ex.exerciseId
                    );
                    // console.log("courseExercise: ", courseExercise)
                    courseExercises.push(courseExercise);
                }
                course = {
                    exercises: {
                        complete: [],
                        incomplete: courseExercises
                    },
                    markCurrentExercise: function (result) {
                        var currentExercise;
                        if (!this.courseComplete()) {
                            currentExercise = this.exercises.incomplete.splice(0, 1)[0];
                            console.log("markCurrentExercise:currentExercise", currentExercise);
                        }
                        if (!currentExercise) {
                            throw "couldn't get current incomplete exercise";
                        }
                        currentExercise.answer = result;
                        this.exercises.complete.push(currentExercise);
                    },
                    courseComplete: function () {
                        return (this.exercises.incomplete.length === 0);
                    },
                    currentExercise: function () {
                        if(!this.CourseComplete) {
                            var firstIncomplete = this.exercises.incomplete[0];
                            helpers.assert(firstIncomplete, "no firstIncomplete");
                            return firstIncomplete;
                        }
                    }
                }

                return course;
            }
        }
    }
}());
