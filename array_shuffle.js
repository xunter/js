
function array_shuffle(arr, inplace = 1) {
    let randomaziedIndexArr = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        let randomizedIndex = -1;
        while (randomizedIndex === -1 || randomaziedIndexArr.includes(randomizedIndex)) {
            randomizedIndex = parseInt( Math.round( Math.random() * (arr.length - 1) ) );
        }

        randomaziedIndexArr[i] = randomizedIndex;
    }
    let randomizedArr = inplace ? arr : new Array(arr.length);
    for (let i = 0; i < randomizedArr.length; i++) {
        randomizedArr[i] = arr[randomaziedIndexArr[i]];
    }
    return randomizedArr;
}

if (typeof(Array.prototype.shuffle) == 'undefined') {
  Array.prototype.shuffle = function(inplace = 1) {
    return array_shuffle(this, inplace);
  }
}
