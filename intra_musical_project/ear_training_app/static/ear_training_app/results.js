/*
When the "make results page public/private" checkbox is clicked, send an AJAX
POST request to the server to update the visibility value in the database. The
request sends "true" if the target checkbox is checked, and false if it is not
checked.
*/
function changeResultsVisibility (evt) {
    "use strict";
    var formData = new FormData(),
        request = new XMLHttpRequest(),
        description = document.getElementById("visibility-description");
        label = document.getElementsByTagName("label")[0];
    if(evt.target.type !== "checkbox") {
        throw "Error: target was not checkbox";
    }
    /* If you change the text of the description or label, don't forget to match
    it to the text in the template. */
    if(evt.target.checked) {
        formData.append("visibility", true);
        description.innerText = "This page is private. Only you can see this page.";
        label.innerText = "Uncheck to make it publicly visible";
    }
    else {
        formData.append("visibility", false);
        description.innerText = "This page is publicly visible. Anyone with your username can see this page.";
        label.innerText = "Check to make it private";
    }
    request.onload = function () {
        console.log(JSON.parse(this.responseText));
        if(this.status === 200) {
            console.log("SUCCESS: changed visibility");
        }
        else {
            console.log("WARNING: possible error updating visibility");
        }
    }
    request.open("POST", "/update-results/");
    request.send(formData);
}

function init() {
    var visibilityCheckbox = document.getElementById("results-visibility");
    visibilityCheckbox.addEventListener("click", changeResultsVisibility);
}

init();
