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
        document.getElementById("course-complete-wrapper").classList.remove("hidden");
        document.getElementById("course-complete-dialogue").classList.remove("hidden");
    }

    function hideCourseCompleteDialogue() {
        document.getElementById("course-complete-wrapper").classList.add("hidden");
        document.getElementById("course-complete-dialogue").classList.add("hidden");
    }

    function toggleBuildCourseButton () {
        var button = document.getElementById("build-course-button");
        console.log("numChecked", helpers.getNumChecked());
        if (helpers.getNumChecked() >= 2) {
            if (button.hasAttribute('disabled')) {
                helpers.enable(button);
            }
        }
        else {
            if (!button.hasAttribute('disabled')) {
                helpers.disable(button);
            }
        }
    }

    function showIntervalSelectionDialogue() {
        document.getElementById("interval-selection-wrapper").classList.remove("hidden");
        var box = document.getElementById("interval-selection-dialogue");
        box.classList.remove("hidden");
        box.addEventListener("click", toggleBuildCourseButton);
        document.getElementById('select-all').addEventListener('click', helpers.checkOrUncheckAll);
    }

    function hideIntervalSelectionDialogue() {
        document.getElementById("interval-selection-wrapper").classList.add("hidden");
        document.getElementById("interval-selection-dialogue").classList.add("hidden");
    }

    function showExerciseContent() {
        var mainContent = document.getElementsByClassName("exercise-content-wrapper")[0];
        if(mainContent.classList.contains("hidden")) {
            mainContent.classList.remove("hidden");
        }
        else {
            throw "already showing exercise content";
        }
    }

    function hideExerciseContent() {
        var mainContent = document.getElementsByClassName("exercise-content-wrapper")[0];
        if(!mainContent.classList.contains("hidden")) {
            mainContent.classList.add("hidden");
        }
        else {
            throw "already hiding exercise content";
        }
    }

    var btn = document.getElementById("dialogue-ok");
    if (btn) {
        btn.addEventListener("click", hideCourseCompleteDialogue);
    }
    else {
        alert("error: dialogue ok-button not found by id");
    }

    function showAnswerDialogue(result, answer) {
        var resultString, answerDialogue, message;
        if (answer === "octave") {
            resultString = "it's an octave.";
        }
        else {
            resultString = "it's a " + answer + ".";
        }
        if (result === "skipped") {
            message = resultString;
        }
        else {
            message = result + ", " + resultString;
        }
        answerDialogue = document.getElementById("answer-result");
        answerDialogue.textContent = message;
        answerDialogue.classList.remove("hidden");
    }

    // handler for click event on "Next" button
    function hideAnswerDialogue(event) {
        document.getElementById("answer-result").classList.add("hidden");
    }
