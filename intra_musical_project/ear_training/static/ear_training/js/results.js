var csrftoken = Cookies.get('csrftoken');
// requires jQuery and js-cookie
/* success handler for ajax update to results visibility */
function updateDone(result) {
    console.log("request successful", result);
    var $description = $("#visibility-description"),
        $label = $("#visibility-label"),
        $errorContainer = $("#error-container");
    if(result.error) {
        console.log(result.error);
        $errorContainer.text("Error during update");
        $label.after($errorContainer);
    }
    else if ($errorContainer.text() !== "") {
        $errorContainer.text("");
    }
    /* If you change the text of the description or label, don't forget to match
    it to the text in the template. */
    if (result.private === true) {
        $description.text("This page is private. Only you can see this page.");
        $label.text("Uncheck to make it publicly visible");
    }
    else if (result.private === false) {
        $description.text("This page is publicly visible. Anyone with your username can see this page.");
        $label.text("Check to make it private");
    }
}

/*
When the "make results page public/private" checkbox is clicked, send an AJAX
POST request to the server to update the visibility value in the database. The
request sends "true" if the target checkbox is checked, and false if it is not
checked.
*/
function changeResultsVisibility (evt) {
    "use strict";
    console.log("changeResultsVisibility running");
    var username = $("#username").text(),
        url = "/" + username + "/update-visibility/",
        data = {};

    if(evt.target.type !== "checkbox") {
        throw "Error: target was not checkbox";
    }

    data["visibility"] = evt.target.checked ? true : false;
    $.ajax({
        "type": "POST",
        "dataType": "json",
        "url": url,
        "data": data,
    }).done(function (result) {
        updateDone(result);
    }).fail(function (result) {
        $("#error-container").text("request failed");
    });
}

function init() {
    var visibilityCheckbox = document.getElementById("results-visibility");
    if (visibilityCheckbox) {
        visibilityCheckbox.addEventListener("click", changeResultsVisibility);
    }
}

window.addEventListener("DOMContentLoaded", init);
