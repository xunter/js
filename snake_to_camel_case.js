
function camelToSnakeCase(token) {
    let s = '';
    for (let i = 0; i < token.length; i++) {
        let chr = token.charAt(i);
        if (chr.toUpperCase() == chr && chr.toLowerCase() != chr.toUpperCase()) {
            s += '_' + chr.toLowerCase();
        } else {
            s += chr;
        }
    }
    return s;
}

function snakeToCamelCase(token) {
    let s = '';
    let iNext = -1;
    for (let i = 0; i < token.length; i++) {
        let chr = token.charAt(i);
        if (chr == '_') {
            if (token.length > i + 1) {
                iNext = i + 1;
                s += token.charAt(iNext).toUpperCase();
            }
        } else {
            if (iNext > -1) {
                iNext = -1;
            } else {
                s += chr;
            }
        }
    }
    return s;    
}

function objectKeysSnakeToCamelCase(obj, duplicate = 0) {
    return changeObjectKeysNamingStyle(obj, 'snake', 'camel', duplicate);
}

function objectKeysCamelToSnakeCase(obj, duplicate = 0) {
    return changeObjectKeysNamingStyle(obj, 'camel', 'snake', duplicate);
}

function changeObjectKeysNamingStyle(obj, caseFrom, caseTo, duplicate = 0) {
    obj = duplicate ? Object.assign({}, obj) : obj;
    let changeCase = caseFrom == 'camel' && caseTo == 'snake' ? camelToSnakeCase : snakeToCamelCase;
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        let keyName = keys[i];
        let changedKeyName = changeCase(keyName);
        if (changedKeyName != keyName) {
            obj[changedKeyName] = obj[keyName];
            delete obj[keyName];
        }
    }
    return obj;
}

// play https://jsfiddle.net/ebap9cL2/
