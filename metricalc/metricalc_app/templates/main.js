// function isDigit(x) {
//     return /[\d]/.test(x);
// }

Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
           isFinite(value) &&
           Math.floor(value) === value;
};

function isPowerOfTwo(x) {
    while ((x & 1) == 0) {
        //console.log(x);
        x /= 2;
    }
    return x == 1;
}

function isPositiveInteger(x) {
    return (Number.isInteger(x) && x > 0)
}

function stripLeadingZeroes(s) {
    while (s.startsWith('0')) {
       s = s.replace(s[0], '');
    }
    return s;
}

function addMeasureGroup() {
    var measureGroupContainer = document.getElementById("all-measure-groups");
    var fieldsets = measureGroupContainer.getElementsByTagName("fieldset");
    var lastFieldset = fieldsets[fieldsets.length - 1];
    //show remove button in top fieldset before cloning
    if (fieldsets.length === 1) {
        var topRemoveButton = fieldsets[0].getElementsByClassName("remove")[0];
        topRemoveButton.removeAttribute("disabled");
    }
    //add new element to the DOM
    var newFieldset = lastFieldset.cloneNode(true);
    measureGroupContainer.appendChild(newFieldset);
    //gets removeButton inside newFieldset adds EventListener to newFieldset
    var removeButton = newFieldset.getElementsByClassName("remove")[0];
    var clearButton = newFieldset.getElementsByClassName("clear")[0];
    removeButton.addEventListener("click", removeMeasureGroup);
    clearButton.addEventListener("click", clearFields);
    document.getElementById("result-container").classList.add("hidden");
}

function removeMeasureGroup(event) {
    var fieldsets = document.getElementsByTagName("fieldset");
    event.target.parentElement.remove();
    if (fieldsets.length === 1) {
        var topRemoveButton = fieldsets[0].getElementsByClassName("remove")[0];
        topRemoveButton.setAttribute("disabled", "true");
    }
    document.getElementById("result-container").classList.add("hidden");
}

function displayResult(measureGroup) {
    var numberOfMeasures = measureGroup.getElementsByClassName("number-of-measures")[0].value;
    var meterTop = measureGroup.getElementsByClassName("meter-top")[0].value;
    var meterBottom = measureGroup.getElementsByClassName("meter-bottom")[0].value;
    var beatsPerMinute = measureGroup.getElementsByClassName("bpm")[0].value;
    var totalBeats = parseInt(numberOfMeasures) * parseInt(meterTop);
    var beatsPerSecond = parseInt(beatsPerMinute) / 60;
    var seconds = Math.round(parseInt(totalBeats) / parseFloat(beatsPerSecond));
    var result = measureGroup.getElementsByClassName("fieldset-result")[0];
    var resultSeconds = document.getElementById("result-seconds");
    resultSeconds.innerHTML = 0;

    result.innerHTML = "lasts " + seconds + " seconds.";
    resultSeconds.innerHTML = parseInt(resultSeconds.innerHTML) + seconds;
}

function calculate() {
    if(validatePositiveIntFields() && validateMeterBottomFields()) {
        document.getElementById("validation-result").innerHTML = "";
                var fieldset = document.getElementsByTagName("fieldset");
        for (var i = 0; i < fieldset.length; i++) {
            var curr = fieldset[i];
            displayResult(curr);
        }
        document.getElementById("result-container").classList.remove("hidden");
    }
    else {
        var fs = document.getElementsByTagName("fieldset");
        for(var i = 0; i < fs.length; i++) {
            //TODO: get fieldset-result to clear when calculation becomes invalid
            var inputs = fs[i].getElementsByTagName("input");
            var result = fs[i].getElementsByClassName("fieldset-result")[0];
            for(var j = 0; j < inputs.length; j++) {
                if(inputs[j].classList.contains("invalid")) {
                    console.log("reseting invalid result");
                    result.innerHTML = "";
                }
            }

        }
        var resultSeconds = document.getElementById("result-seconds");
        resultSeconds.innerHTML = "";
        document.getElementById("result-container").classList.add("hidden");
    }
}

function updateIntegerInputValues(elem) {
    if(elem.value === "") { return; }
    var newValue = stripLeadingZeroes(elem.value);
    if (newValue === "") {
        newValue = 0;
    }
    else {
        newValue = parseInt(newValue);
    }
    if (elem.value !== newValue) {
        elem.value = newValue;
    }
}

function validatePositiveIntFields() {
    var isValid = true;
    var positiveIntFields = document.getElementsByClassName("positive");
    for(var i = 0; i < positiveIntFields.length; i++) {
        var curr = positiveIntFields[i];
        updateIntegerInputValues(curr);
        if(!isPositiveInteger(parseInt(curr.value))) {
            curr.classList.add("invalid");
            var result = document.getElementById("validation-result");
            result.innerHTML = "Please use positive integers for all fields.";
            isValid = false;
        }
        else if(curr.classList.contains("invalid")) {
            curr.classList.remove("invalid");
        }
    }

    return isValid;
}

function validateMeterBottomFields() {
    var isValid = true;
    var meterBottomFields = document.getElementsByClassName("meter-bottom");
    for (var i = 0; i < meterBottomFields.length; i++) {
        var curr = meterBottomFields[i];
        updateIntegerInputValues(curr);
        if(!(isPositiveInteger(parseInt(curr.value)) && isPowerOfTwo(parseInt(curr.value)))) {
            curr.classList.add("invalid");
            var result = document.getElementById("validation-result");
            result.innerHTML += " Use a power of two for denominator of the meter.";
            isValid = false;
        }
        else if(curr.classList.contains("invalid")) {
            curr.classList.remove("invalid");
        }
    }
    return isValid;
}

function clearFields(event) {
    // console.log("Clear!");
    var inputs = event.target.parentElement.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
        if(inputs[i].classList.contains("invalid")){
            inputs[i].classList.remove("invalid");
        }
    }
    var fsResult = event.target.parentElement.getElementsByClassName("fieldset-result")[0];
    fsResult.innerHTML = "";
    var resultContainer = document.getElementById("result-container");
    resultContainer.classList.add("hidden");
}

function showSavePieceDialogue(event) {
    document.getElementById("grayout").classList.remove("hidden");
    document.getElementById("save-dialogue").classList.remove("hidden");
}

function hideSavePieceDialogue(event) {
    document.getElementById("grayout").classList.add("hidden");
    document.getElementById("save-dialogue").classList.add("hidden");
}

function savePiece() {
    console.log("saving piece");
}

function init () {
    var addButton = document.getElementById("add-button");
    var calcButton = document.getElementById("calculate-button");
    var savePieceButton = document.getElementById("save-piece-button");
    var removeButton = document.getElementsByClassName("remove")[0];
    var clearButton = document.getElementsByClassName("clear")[0];
    var dialogueCancelButton = document.getElementById("dialogue-cancel-button");
    var dialogueSaveButton = document.getElementById("dialogue-save-button");
    addButton.addEventListener("click", addMeasureGroup);
    calcButton.addEventListener("click", calculate);
    savePieceButton.addEventListener("click", showSavePieceDialogue);
    removeButton.addEventListener("click", removeMeasureGroup);
    removeButton.setAttribute("disabled", "true");
    clearButton.addEventListener("click", clearFields);
    dialogueCancelButton.addEventListener("click", hideSavePieceDialogue);
    dialogueSaveButton.addEventListener("click", function () {
        savePiece();
        hideSavePieceDialogue();
    });

}

document.addEventListener("DOMContentLoaded", init);
