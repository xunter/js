
function str_trim_start(str, chr) {
	if (typeof(chr) == "undefined") {
		chr = " ";
	}
	var s = str;
	while (s.indexOf(chr) === 0) {
		s = s.substr(1);
	}
	return s;
}
if (typeof (String.prototype.trimStart) == "undefined") {
    String.prototype.trimStart = function (chr) {
        return str_trim_start(this, chr);
    };
}

function str_trim_end(str, chr) {
	if (typeof(chr) == "undefined") {
		chr = " ";
	}
	var s = str;
	while (s.lastIndexOf(chr) === s.length - 1) {
		s = s.substr(0, s.length - 1);
	}
	return s;
}
if (typeof (String.prototype.trimEnd) == "undefined") {
    String.prototype.trimEnd = function (chr) {
        return str_trim_end(this, chr);
    };
}

function str_trim(str, chr) {
	var s = str;
	s = str_trim_start(s, chr);
	s = str_trim_end(s, chr);
	return s;
}
if (typeof (String.prototype.trim) == "undefined") {
    String.prototype.trim = function (chr) {
        return str_trim(this, chr);
    };
}
