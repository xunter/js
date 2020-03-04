
function array_none(arr) {
    return arr.filter(a => 0);
}

if (Array.prototype.none != null) {
    Array.prototype.none = function() {
        return array_none(this);
    }
}
