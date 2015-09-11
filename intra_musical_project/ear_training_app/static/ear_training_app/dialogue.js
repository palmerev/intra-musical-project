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

    function showCCDialogue() {
        console.log("SHOWING!");
        var courseResults = EP.course.studentExercises;
        var overallResults = makeOverallResults(courseResults);
        document.getElementById("cc-grayout").classList.remove("hidden");
        document.getElementById("cc-dialogue").classList.remove("hidden");
    }

    function hideCCDialogue() {
        console.log("HIDING!");
        document.getElementById("cc-grayout").classList.add("hidden");
        document.getElementById("cc-dialogue").classList.add("hidden");
    }

    var btn = document.getElementById("dialogue-ok");
    if (btn) {
        btn.addEventListener("click", hideCCDialogue);
    }
    else {
        alert("error: dialogue ok-button not found by id");
    }
// }
    function hideSIDialogue() {
        document.getElementById("si-grayout").classList.add("hidden");
        document.getElementById("si-dialogue").classList.add("hidden");
    }
//document.addEventListener("DOMContentLoaded", init);
