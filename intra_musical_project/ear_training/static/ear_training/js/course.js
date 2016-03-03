//needs tones.js


function showResult(event){
    var result = document.getElementById("answer-result");
    var correctAnswer = document.getElementById("correct-answer");
    if(result.innerHTML === ""){
        var s = event.target.style;
        s.border = "3px solid yellow";
        s.background = "blue";
            if (event.target.innerHTML === EP.currentExercise.intervalName) {
            result.style.color = "blue";
            result.innerHTML = "Correct!";
        }
        else {
            result.style.color = "red";
            result.innerHTML = "Incorrect. It's a " + EP.currentExercise.intervalName + ".";
        }
    }
}

document.addEventListener("DOMContentLoaded", showIntervalSelectionDialogue);
