

function concatObj(element, obj) {
    var newObj = {};
    if(Array.isArray(element)) {
        var newElement = {}
        element.forEach(function(e, i) {
            newElement = concatObj(e, newElement)
            element = newElement;
            newObj[e] = element;
        }.bind(this));
    }
    newObj[element] = obj
    return newObj;
}

var arr = ["1", "2", "3", "4"];
var obj = {};
arr.reverse().forEach(function(e) {
    obj = concatObj(e, obj);
})
var a = {"1": {"2": "2"}};
res(a["1"]);
console.log(a)

function res(obj) {
    obj["3"] = "5";
}