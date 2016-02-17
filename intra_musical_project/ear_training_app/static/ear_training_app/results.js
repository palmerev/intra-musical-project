var csrftoken = Cookies.get('csrftoken');
// requires jQuery and js-cookie
/* success handler for ajax update to results visibility */
function updateDone(result) {
    console.log("SUCCESS", result);
    var description = document.getElementById("visibility-description"),
        label = document.getElementsByTagName("label")[0];
    /* If you change the text of the description or label, don't forget to match
    it to the text in the template. */
    if (result.visibility === true) {
        description.innerText = "This page is private. Only you can see this page.";
        label.innerText = "Uncheck to make it publicly visible";
    }
    else {
        description.innerText = "This page is publicly visible. Anyone with your username can see this page.";
        label.innerText = "Check to make it private";
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
    var username = document.getElementById("username").innerText,
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
        "done": updateDone(result),
        "fail": function (result) {
            console.log("FAIL", result);
        }
    });
}

function init() {
    var visibilityCheckbox = document.getElementById("results-visibility");
    if (visibilityCheckbox) {
        visibilityCheckbox.addEventListener("click", changeResultsVisibility);
    }
}

window.addEventListener("DOMContentLoaded" init);
