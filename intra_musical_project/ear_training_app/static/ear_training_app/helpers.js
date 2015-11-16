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
      returns a random integer i: 0 <= i < length
    */
    randIndex: function (length) {
        num = Math.floor(Math.random() * length);
        return num;
    },

    /*
      returns a random sample of n elements from arr.
      arr is not modified.
    */
    randomSample: function (n, arr) {
        var selected = [];
        var list = arr.slice();
        for (var i = 0; i < n; i++) {
            var count = list.length;
            var index = parseInt(Math.random() * count);
            var item = list.splice(index, 1)[0];
            selected.push(item);
        }
        return selected;
    },

    /*
    Decorate, sort, undecorate pattern
    modifies the original list
     */
    inPlaceShuffle: function (list) {
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            item.randomNumber = Math.random();
        }
        // console.log("presort:" + list);
        list.sort(compare);
        // console.log("postsort:" + list);
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            delete item.randomNumber;
        }
        // console.log("postdelete:" + list);
    },

    copyShuffle: function (arr) {
        var list = arr.slice();
        var arrayLength = arr.length;
        var result = [];
        for (var i = 0; i < arrayLength; i++) {
            var randIdx = randIndex(list.length);
            //pull out a random element from arrCopy and append it to result
            result.push(list.splice(randIdx, 1)[0]);
        }
        return result;
    },

    compare: function (a, b) {
        if (a.randomNumber > b.randomNumber) {
            return 1;
        } else if (a.randomNumber < b.randomNumber) {
            return -1;
        }
        return 0;
    },

    printList: function (selected) {
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            document.write(item.name + "<br>");
        }
    },

    printObject: function (obj){
        document.write("{<br />")
        for(prop in obj) {
          document.write("&nbsp;&nbsp;" + prop + ": " + obj[prop] + ",<br />");
        }
        document.write("}<br />");
    },

    cloneObject: function (inputObject) {
        this.assert(false, "cloneObject probably broken");
        var targetClone = new Object();
        var properties = Object.keys(inputObject);
        for(var i = 0; i < properties.length; i++) {
            var p = properties[i];
            targetClone[p]= inputObject[p];
        }
        return targetClone;
    },
    /*
    searches list and returns the integer index of the first object that has a
    property called propertyName with a value of propertyValue. Returns -1 if
    no match is found.
    */
    getObjectIndexByProperty: function (propertyName, propertyValue, list) {
        var lst = list.slice();
        var targetExercise;
        for (var i = 0; i < lst.length; i++) {
            if (lst[i][propertyName] === propertyValue){
                return i;
            }
        }
        return -1;
    },

    getExerciseByProperty: function (propertyName, propertyValue, list) {
        var lst = list.slice();
        var targetExercise;
        var targetClone;
        for (var i = 0; i < lst.length; i++) {
            if (lst[i][propertyName] === propertyValue){
               targetExercise = lst[i];
               targetClone = cloneObject(targetExercise);
            }
        }
        return targetClone;
    },

    /*
    Takes a string and returns a new version of it with the first letter capitalized.
    */
    capitalizeFirstLetter: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /*
    Gets the innerText of elements with a class of "interval-label",
    which should be interval names
    */
    getCheckedNames: function () {
       var intervalLabels = document.getElementsByClassName("interval-label");
       var checkedIntervals = _.filter(intervalLabels, function getChecked(label) {
           return label.children[0].checked;
       });
       var nameList = [];
       return _.map(checkedIntervals, function extractName(label) {
           return label.childNodes[0].textContent.trim();
       });
    },

    /*
    Gathers all the ids checkboxes that are checked concatenates them into a
    string, separated by spaces, and returns that string.
    */
    getIdsOfChecked: function () {
        var boxes = document.getElementsByTagName("input");
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
    // -------- THESE FUNCTIONS MAY BE USEFUL FOR TESTING PURPOSES ----------
    _displayChecked: function (){
        var checkedStr = getIdsOfChecked();
        var output = document.getElementById("output");
        if (output === null) {
            var p = document.createElement("p");
            p.id = "output";
            document.body.appendChild(p);
            output = p;
        }
        else {
            output.innerHTML = "";
        }
        output.innerHTML = checkedStr;
        _printList(makeIntervalNames(getIdsOfChecked()));
    },

    _printList: function (list) {
        var outputString = "";
        for (var i = 0; i < list.length; i++) {
            outputString += list[i].toString() + " ";
        }
        outputString = outputString.slice(0, -1);
        var outputElement = document.createElement("p");
        outputElement.innerHTML = outputString;
        document.body.appendChild(outputElement);
    }

}
  //export to window
  window.helpers = helpers;
}(window));
