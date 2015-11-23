    function makeOverallResults(exercises) {
        console.log("MAKING OVERALL RESULTS");
        console.log(exercises);
        var dialogueCompleted = document.getElementById("ex-completed");
        var dialogueCorrect = document.getElementById("ex-correct");
        var dialogueIncorrect = document.getElementById("ex-incorrect");
        var dialogueSkipped = document.getElementById("ex-skipped");
        var totalCorrect = 0;
        var totalIncorrect = 0;
        var totalSkipped = 0;
        for (var i = 0; i < exercises.length; i++){
            switch(exercises[i].answer){
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
                throw new Error("error: unknown answer!");
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
        if (IM.course.exercises.incomplete.length > 0) { throw Error("some exercises are still incomplete"); }
        var completedExercises = IM.course.exercises.complete;
        makeOverallResults(completedExercises);
        document.getElementById("course-complete-grayout").classList.remove("hidden");
        document.getElementById("course-complete-dialogue").classList.remove("hidden");
    }

    function hideCourseCompleteDialogue() {
        document.getElementById("course-complete-grayout").classList.add("hidden");
        document.getElementById("course-complete-dialogue").classList.add("hidden");
    }

    function showIntervalSelectionDialogue() {
        document.getElementById("interval-selection-grayout").classList.remove("hidden");
        var box = document.getElementById("interval-selection-dialogue");
        box.classList.remove("hidden");
        box.addEventListener("click", function () {
            var button = document.getElementById("build-course-button");
            console.log("clicked on box");
            console.log("numChecked", helpers.getNumChecked());
            if (helpers.getNumChecked() >= 2) {
                if (button.classList.contains('hidden')) {
                    button.classList.remove('hidden');
                }
            }
            else {
                if (!button.classList.contains('hidden')) {
                    button.classList.add('hidden');
                }
            }
        });
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
