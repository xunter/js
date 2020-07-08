
function arraysEqual(...arrs) {
    let opts = arrs.filter(arr => arr === "any");
    let any = opts.includes("any");
    arrs = arrs.filter(arr => Array.isArray(arr));

    if (!arrs.length) {
        return false;
    }
    let arr1 = arrs[0];
    arrs = arrs.slice(1);
    if (any) {
        return arrs.filter(arr => arraysEqual(arr1, arr)).length;
    }

    if (arrs.filter(arr => arr.length !== arr1.length).length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arrs.filter(arr => arr[i] != arr1[i]).length) {
            return false;
        }
    }

    return true;
}
if (!Array.prototype.equals) {
    Array.prototype.equals = function(...others) {
        return arraysEqual(this, ...others);
    }
}
if (!Array.prototype.equalsAny) {
    Array.prototype.equalsAny = function(...others) {
        return arraysEqual(this, ...others, "any");
    }
}
if (!Array.equal) {
    Array.equal = function(...arrays) {
        return arraysEqual(...arrays);
    }
}
if (!Array.equalAny) {
    Array.equalAny = function(...arrays) {
        return arraysEqual(...arrays, "any");
    }
}
