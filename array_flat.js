/*
JavaScript js function
Array flat flatten Array.flat
@xunter
*/

function flatArr(arr, depth) {
	let flattenArr = [];
	
	let arrMapStack = [{ arr: arr, i: 0, depth: 0 }];
	
	depth = depth || 1;
	
	while (arrMapStack.length) {
		let currarrscope = arrMapStack.pop();
		let currarr = currarrscope.arr;
		let curri = currarrscope.i;
		let currdepth = currarrscope.depth;
		
		for (let i = curri; i < currarr.length; i++) {
			if (!Array.isArray(currarr[i]) || currdepth == depth) {
				flattenArr.push(currarr[i]);
			} else {
				arrMapStack.push({ arr: currarr, i: i + 1, depth: currdepth });
				arrMapStack.push({ arr: currarr[i], i: 0, depth: currdepth + 1 });
				break;
			}
		}	
		
	}
	
	return flattenArr;
}
var array_flat = flatArr;
if (typeof (Array.prototype.flat) == "undefined") {
    Array.prototype.flat = function (depth) {
        return array_flat(this, depth);
    };
}