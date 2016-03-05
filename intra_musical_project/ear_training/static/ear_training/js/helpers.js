(function (window) {
    var helpers = {
    assert: function (condition, message) {
      var message = message || "assertion failed";
      if (!condition) {
        throw message;
      }
    },
    /*
      returns true if an array is empty, otherwise false
    */
    isEmptyArray: function (arr) {
       if(arr.length === 0) {
         return true;
       }
       else {
         return false;
       }
    },

    /*
      checks or unchecks all checkboxes based on the 'select all' checkbox
    */
    checkOrUncheckAll: function () {
        var selectedAll = document.getElementById("select-all").checked;
        var checkboxes = document.querySelectorAll("input[type=checkbox]");
        if (selectedAll) {
            for(var i = 0; i < checkboxes.length; i++) {
                checkboxes[i].checked = true;
            }
        }
        else {
            for (var i = 0; i < checkboxes.length; i++) {
                checkboxes[i].checked = false;
            }
        }

    },
    /*
    Get the value of the radio button for the course length.
    */
    getCourseLength: function () {
        var radios = document.getElementsByClassName("course-length");
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return radios[i].id;
            }
        }
    },

    /*
    Gets the ids of the checkboxes that are checked,
    which should be interval names in the form "foo-bar",
    and returns the names in the form "foo bar"
    */
    getCheckedNames: function () {
        var checkedNames = [],
            currentId,
            name;
        try {
            var checkedBoxes = document.querySelectorAll("input.interval:checked");
            for (var i = 0; i < checkedBoxes.length; i++) {
                currentId = checkedBoxes[i].id;
                name = currentId.replace("-", " ")
                checkedNames.push(name);
            }
        }
        catch(e) {
            var allBoxes = document.querySelectorAll("input.interval");
            for(var i = 0; i < checkedBoxes.length; i++) {
                if (allBoxes[i].checked) {
                    currentId = allBoxes[i].id;
                    name = currentId.replace("-", " ");
                    checkedNames.push(name);
                }
            }
        }
        return checkedNames;
    },

    getNumChecked: function () {
        try {
            var checkedBoxes = document.querySelectorAll("input[type='checkbox']:checked");
            return checkedBoxes.length;
        }
        catch(e) {
            var numChecked = 0;
            var allBoxes = document.querySelectorAll("input");
            for(var i = 0; i < checkedBoxes.length; i++) {
                if (checkBoxes[i].type == 'checkbox' && checkedBoxes[i].checked) {
                    numChecked += 1;
                }
            }
            return numChecked;
        }
    },

    /*
    Gathers all the ids checkboxes that are checked concatenates them into a
    string, separated by spaces, and returns that string.
    */
    getIdsOfChecked: function () {
        var boxes = document.querySelectorAll("input[type='checkbox']");
        var checkedString = "";
        for (var i = 0; i < boxes.length; i++) {
            var box = boxes[i];
            if(box.checked) {
              checkedString += box.id + " ";
            }
        }
        var outputString = checkedString.slice(0,-1);
        return outputString;
    },

    disable: function (btn) {
        btn.setAttribute("disabled", "");
        btn.classList.add("disabled");
    },

    enable: function (btn) {
        btn.removeAttribute("disabled");
        btn.classList.remove("disabled");
    }
}
  //export to window
  window.helpers = helpers;
}(window));
