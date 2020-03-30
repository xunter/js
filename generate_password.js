
function generate_password(len = 12) {
    const AZ = 'QWERTYUIOPASDFGHJKLZXCVBNM';
    const az = AZ.toLowerCase();
    const digits = '1234567890';
    const specials = '!@#$%^&*()_+|{}[]№;:?/-,.=~';

    let requireAZ = 1;
    let requireaz = 1;
    let require09 = 1;
    let require_$ = 1;

    let types = { CAPITALS: 'A', REGULARS: 'a', SPECIALS: '_', DIGITS: '9' };
    let typeStr = { [types.CAPITALS]: AZ, [types.REGULARS]: az, [types.DIGITS]: digits, [types.SPECIALS]: specials };
    let typeArr = [];

    let pwdArr = new Array();
    if (requireAZ) {
        typeArr.push(types.CAPITALS);
    }
    if (requireaz) {
        typeArr.push(types.REGULARS);
    }
    if (require09) {
        typeArr.push(types.DIGITS);
    }
    if (require_$) {
        typeArr.push(types.SPECIALS);
    }

    for (let i = pwdArr.length; i < len; i++) {
        let typeIndex = parseInt( Math.round( Math.random() * (typeArr.length - 1) ) );
        pwdArr.push(typeArr[typeIndex]);
    }

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

    array_shuffle(pwdArr);

    for (let i = 0; i < pwdArr.length; i++) {
        let typeChr = pwdArr[i];
        let chrStr = typeStr[typeChr];
        let chrIndex = parseInt( Math.round( Math.random() * (chrStr.length - 1) ) );
        let chr = chrStr[chrIndex];
        pwdArr[i] = chr;
    }

    let pwd = pwdArr.join('');

    return pwd;
}
