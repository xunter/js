let arr = [
0,0,0,1,
1,0,0,0,
1,0,1,1,
0,1,1,1
];

const SIZE = 4;

let historyMap = {};
let ships = [];

let getIndexByCoords = (r,c) => r * SIZE + c;
//let getCoordsByIndex = (i) => { r: Math.floor(i / SIZE), c: i % SIZE };

for (let i = 0; i < arr.length; i++) {
	let r = Math.floor(i / SIZE);
	let c = i % SIZE;
	//console.log("r = %s, c = %s, i = %s, v = %s", r, c, i, arr[i]);
	let placed = arr[i] == 1;
	if (historyMap[i] && historyMap[i].length) {
		placed = false;
	}
	
	if (placed) {
		let shipCoords = [i];
		ships.push(shipCoords);
		historyMap[i] = shipCoords;
		
		let indexRight = -1;
		if (c < SIZE - 1) {
			indexRight = getIndexByCoords(r, c + 1);
			if (arr[indexRight] == 1 && !historyMap[indexRight]) {
					//console.log("right = "+ indexRight);
				shipCoords.push(indexRight);
				historyMap[indexRight] = shipCoords;
				
				for (let j = c + 2; j < SIZE; j++) {
					let indexNext = getIndexByCoords(r, j);
					if (arr[indexNext] == 1 && !historyMap[indexNext]) {
					//console.log("right next = "+ indexNext);
						shipCoords.push(indexNext);
						historyMap[indexNext] = shipCoords;
						continue;
					}
					break;
				}
			} else {
				indexRight = -1;
			}
		}
		
		let indexBottom = -1;
		if (indexRight === -1) {
			if (r < SIZE - 1) {
				indexBottom = getIndexByCoords(r + 1, c);
				if (arr[indexBottom] == 1 && !historyMap[indexBottom]) {
					//console.log("bottom = "+ indexBottom);
					shipCoords.push(indexBottom);
					historyMap[indexBottom] = shipCoords;
					
					for (let j = r + 2; j < SIZE; j++) {
						let indexNext = getIndexByCoords(j, c);
						if (arr[indexNext] == 1 && !historyMap[indexNext]) {
					//console.log("bottom next = "+ indexNext);
							shipCoords.push(indexNext);
							historyMap[indexNext] = shipCoords;
							continue;
						}
						break;
					}
				}
			}
		}
		
		
		
	}
}

console.log(ships.length);
console.log(ships);
console.log(historyMap);