/*
  returns a random integer i: 0 <= i < length
*/
function randIndex(length) {
    num = Math.floor(Math.random() * length);
    return num;
}

/*
  returns a random sample of n elements from arr.
  arr is not modified.
*/
function randomSample(n, arr) {
    var selected = [];
    var list = arr.slice();
    for (var i = 0; i < n; i++) {
        var count = list.length;
        var index = parseInt(Math.random() * count);
        var item = list.splice(index, 1)[0];
        selected.push(item);
    }
    return selected;
}

/*
Decorate, sort, undecorate pattern
modifies the original list
 */
function inPlaceShuffle(list) {
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
}

function copyShuffle(arr) {
    var list = arr.slice();
    var arrayLength = arr.length;
    var result = [];
    for (var i = 0; i < arrayLength; i++) {
        var randIdx = randIndex(list.length);
        //pull out a random element from arrCopy and append it to result
        result.push(list.splice(randIdx, 1)[0]);
    }
    return result;
}

function compare(a, b) {
    if (a.randomNumber > b.randomNumber) {
        return 1;
    } else if (a.randomNumber < b.randomNumber) {
        return -1;
    }
    return 0;
}

function printList(selected) {
    for (var i = 0; i < selected.length; i++) {
        var item = selected[i];
        document.write(item.name + "<br>");
    }
}

function printObject(obj){
    document.write("{<br />")
    for(prop in obj) {
      document.write("&nbsp;&nbsp;" + prop + ": " + obj[prop] + ",<br />");
    }
    document.write("}<br />");
}

function cloneObject(inputObject) {
    var targetClone = new Object();
    var properties = Object.keys(inputObject);
    for(var i = 0; i < properties.length; i++) {
        var p = properties[i];
        targetClone[p]= inputObject[p];
    }
    return targetClone;
}

function getObjectIndexByProperty(propertyName, propertyValue, list){
    var lst = list.slice();
    var targetExercise;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i][propertyName] === propertyValue){
            return i;
        }
    }
    return -1;
}

function getExerciseByProperty(propertyName, propertyValue, list){
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
}
