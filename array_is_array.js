function is_array(o) {

	if (!o) return false;
	if (typeof(o) != "object") return false;
	return Object.prototype.toString.call(obj) === '[object Array]';
};

if (typeof(Array.isArray)=="undefined") {
	Array.isArray = function(o) {
		return is_array(o);
	};
}
