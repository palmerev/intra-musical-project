 //re-structuring course.js to use object-oriented JS
//requires helpers.js
function createNote(letterName, octave) {
    letterNames = [
      "Ab", "A", "A#", "Bb", "B", "B#",
      "Cb" "C", "C#", "Db" "D", "D#",
       "Eb", "E", "E#", "Fb", "F", "F#", "Gb", "G", "G#"]

    if(letterNames.indexOf(letterName) === -1) {
        console.log("Invalid letter name: " + letterName);
        return false;
    }
    //TODO: check that octave is an integer > 0
    else {
        var note = new Object();
        note.letterName = letterName;
        note.octave = octave;
    }

    return note;
}


/*
    params:
    id:integer - unique id of the exercise from Django
    topNote:Note()
    bottomNote:Note()
*/
function Exercise(id, topNote, bottomNote){}

function Course(student, exercises){
    this.student = student;
    if(!Array.isArray(exercises)) {
      console.log("ERROR: exercises should be an Array");
    }
    else if(isEmptyArray(exercises))
    else {
        this.exercises = {
            complete: exercises,
            incomplete: []
        }
    }
}

Course.prototype.student = student;
Course.prototype.numExercises = function() {
    return this.exercises.complete.length + this.exercises.incomplete.length;
}
