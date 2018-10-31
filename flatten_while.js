var arr = [1,2,3,[11,22,[111,222,333,444, [1111,[11111,[123456],55555],2222,3333,4444,5555],555],33,44,55],4,5];

//without recursion - only for and while

function flatArr(arr) {
	let flattenArr = [];
	
	let arrMapStack = [{ arr: arr, i: 0 }];
	
	while (arrMapStack.length) {
		let currarrscope = arrMapStack.pop();
		let currarr = currarrscope.arr;
		let curri = currarrscope.i;
		
		for (let i = curri; i < currarr.length; i++) {
			if (typeof(currarr[i]) == "number") {
				flattenArr.push(currarr[i]);
			} else {
				arrMapStack.push({ arr: currarr, i: i + 1 });
				arrMapStack.push({ arr: currarr[i], i: 0 });
				break;
			}
		}	
	}
	
	return flattenArr;
}

console.log("flatten = %s", flatArr(arr));