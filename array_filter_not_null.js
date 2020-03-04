
function array_filter_not_null(arr) {
    return arr.filter(a => a);
}

if (Array.prototype.notNull != null) {
    Array.prototype.notNull = function() {
        return array_filter_not_null(this);
    }
}
if (Array.prototype.filterNotNull != null) {
    Array.prototype.filterNotNull = function() {
        return array_filter_not_null(this);
    }
}
