const moment = require('moment');

function getPeriodsFromDates(...dates) {
    let momentify = dates.includes('moment');
    dates = flatten(dates).filter(d => d !== 'moment');
    let periods = [];
    for (date of dates) {
        let periodMatching = periods.find(p => moment(date).diff(moment(p.to), "days") === 1);
        let datePushing = momentify ? moment(date) : date;
        if (periodMatching) {
            periodMatching.to = datePushing;
        } else {
            let datePeriod = { from: datePushing, to: datePushing };
            periods.push(datePeriod);
        }
    }
    return periods;
}

// date1, date2, date3 => { from: date1, to: date3 }
