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

    function showCourseCompleteDialogue() {
        //console.log("SHOWING!");
        var courseResults = EP.course.studentExercises;
        var overallResults = makeOverallResults(courseResults);
        document.getElementById("course-complete-grayout").classList.remove("hidden");
        document.getElementById("course-complete-dialogue").classList.remove("hidden");
    }

    function hideCourseCompleteDialogue() {
        //console.log("HIDING!");
        document.getElementById("course-complete-grayout").classList.add("hidden");
        document.getElementById("course-complete-dialogue").classList.add("hidden");
    }

    function hideIntervalSelectionDialogue() {
        document.getElementById("interval-selection-grayout").classList.add("hidden");
        document.getElementById("interval-selection-dialogue").classList.add("hidden");
    }

    var btn = document.getElementById("dialogue-ok");
    if (btn) {
        btn.addEventListener("click", hideCourseCompleteDialogue);
    }
    else {
        alert("error: dialogue ok-button not found by id");
    }
