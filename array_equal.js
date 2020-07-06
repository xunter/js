function arrays_equal(...arrs) {
    if (!arrs.length) {
        return false;
    }
    let arr1 = arrs[0];
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
if (!Array.equal) {
    Array.equal = function(...arrays) {
        return arraysEqual(...arrays);
    }
}
