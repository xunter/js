// inn check

export function check_inn(value) {
    value = (value || "").toString().trim();
    if (value.length === 12) {
        // fl
        return check_inn_fl(value);
    } else if (value.length === 10) {
        return check_inn_org(value);
    } else {
        return false;
    }
}

function check_inn_org(value) {
    const factors = [2, 4, 10, 3, 5, 9, 4, 6, 8, 0];
    const controlDigit = calc_control_digit(value, factors);
    return controlDigit === +value.charAt(9);
}

function check_inn_fl(value) {
    const factors11 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8, 0];
    const factors12 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8, 0];
    const controlDigit11 = calc_control_digit(value, factors11);
    const controlDigit12 = calc_control_digit(value, factors12);
    return controlDigit11 === +value.charAt(10) && controlDigit12 === +value.charAt(11);
}

function calc_control_digit(value, factors) {
    let checksum = 0;
    for (let i = 0; i < factors.length; i++) {
        const num = +value.charAt(i);
        if (Number.isNaN(num)) {
            return Number.NaN;
        }
        checksum += num * factors[i];
    }
    let controlDigit = checksum % 11;
    if (controlDigit > 9) {
        controlDigit %= 10;
    }
    return controlDigit;
}

/*
const inn10incorrect = "7743013902";
const inn10correct = "3808216447";
console.log(check_inn(inn10incorrect));
console.log(check_inn(inn10correct));

const inn12correct1 = "050600447000";
const inn12correct2 = "773604316599";
console.log(check_inn(inn12correct1));
console.log(check_inn(inn12correct2));
*/
