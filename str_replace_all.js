var str_replaceAll = function (str, find, replace) {	
	let sres = "";
	const ss = [];
	ss.push(str);
	while (ss.length) {
		let stmp = ss.pop();
		let index = stmp.indexOf(find);
		if (index !== -1) {
			let sprev = stmp.substr(0, index);
			sres += sprev;
			sres += replace;
			let snext = stmp.substr(index + find.length);
			ss.push(snext);
		} else {
			sres += stmp;
		}
	}
	return sres;
};
if (typeof (String.prototype.replaceAll) == "undefined") {
    String.prototype.replaceAll = function (find, replace) {
        return str_replaceAll(this, find, replace);
    };
}