function array_unique(arr) {
    return arr.filter((a, i) => arr.indexOf(a) === i);
}
if (Array.prototype.unique != null) {
    Array.prototype.unique = function() {
        return array_unique(this);
    };
}
