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


function updateProgressCounter() {
    var current = document.getElementById("current");
    var currentCount = parseInt(current.innerHTML);
    var totalExercises = document.getElementById("course-total");
    var totalExercisesCount = parseInt(totalExercises.innerHTML);

    if(totalExercises.innerHTML === "") {
        initProgressCounter(current, totalExercises);
        return;
    }

    if (currentCount < totalExercisesCount) {
        current.innerHTML = currentCount + 1;
    }
}

function resetStylesAndSound() {
      //reset styles that have changed
      var result = document.getElementById("answer-result");
      result.innerHTML = "";
      var answerBtns = document.getElementsByClassName("answer-button");
      for (var i = 0; i < answerBtns.length; i++) {
          if (answerBtns[i].hasAttribute("style")) {
              answerBtns[i].style.background = "linear-gradient(to bottom, #E38900, #C06600)";
              answerBtns[i].style.border = "none";
          }
      }
      //set sound quality
      tones.type = "sine";
      tones.release = 150;
}


document.addEventListener("DOMContentLoaded", showIntervalSelectionDialogue);
