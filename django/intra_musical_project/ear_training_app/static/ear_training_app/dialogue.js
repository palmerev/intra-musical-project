// function init() {
    function makeOverallResults(resultsObj) {
        console.log("MAKING OVERALL RESULTS");
        console.log(resultsObj);
        var dialogueCompleted = document.getElementById("ex-completed");
        var dialogueCorrect = document.getElementById("ex-correct");
        var dialogueIncorrect = document.getElementById("ex-incorrect");
        var dialogueSkipped = document.getElementById("ex-skipped");
        var totalCorrect = 0;
        var totalIncorrect = 0;
        var totalSkipped = 0;
        for (var i = 0; i < resultsObj.length; i++){
            switch(resultsObj[i]["exercise_result"]){
              case "correct":
                totalCorrect++;
                break;
              case "incorrect":
                totalIncorrect++;
                break;
              case "skipped":
                totalSkipped++;
                break;
              default:
                console.log("error: unknown exercise_result!");
                break;
            }
        }
        var totalComplete = totalCorrect + totalIncorrect;
        dialogueCompleted.innerHTML = totalComplete;
        dialogueCorrect.innerHTML = totalCorrect;
        dialogueIncorrect.innerHTML = totalIncorrect;
        dialogueSkipped.innerHTML = totalSkipped;
    }

    function showDialogue() {
        console.log("SHOWING!");
        var courseResults = EP.course.studentExercises;
        var overallResults = makeOverallResults(courseResults);
        document.getElementById("grayout").classList.remove("hidden");
        document.getElementById("dialogue").classList.remove("hidden");
    }

    function hideDialogue() {
        console.log("HIDING!");
        document.getElementById("grayout").classList.add("hidden");
        document.getElementById("dialogue").classList.add("hidden");
    }

    var btn = document.getElementById("dialogue-ok");
    if (btn) {
        console.log("added eventListener to ok-button");
        btn.addEventListener("click", hideDialogue);
    }
    else {
        alert("error: dialogue ok-button not found by id");
    }
// }

//document.addEventListener("DOMContentLoaded", init);
