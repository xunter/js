(function (window) {

    //format number to static length string (00001, where digits = 5, num = 1)
    var formatNumber = window.formatNumber = function (num, digits) {
        var numText = num.toString();
        if (numText.length >= digits) return numText;

        var
            shift = digits - numText.length,
            s = "";

        for (var i = 0; i < shift; i++) {
            s += "0";
        }
        return s + numText;
    };

    //format sum number with the docs style
    formatSum = window.formatSum = function (sum, decimalSeparator, groupSeparator) {
        var groupSeparator = groupSeparator ? groupSeparator : "";
        if (!sum) return sum;
        var
            integralPartStringBuffer = "",
            fsum = Math.floor(sum),
            rsum = sum - fsum,
            rsum2digits = Math.round(rsum * 100),
            decimalSeparator = decimalSeparator || "-";

        if (groupSeparator.length) {
            var arr = [];
            var fsumString = fsum.toString();
            var fsumStringLength = fsumString.length;
            var counter = 1;
            for (var i = fsumStringLength - 1; i >= 0; i--) {
                var currChr = fsumString.charAt(i);
                arr.push(currChr);
                if (counter++ % 3 === 0) {
                    arr.push(groupSeparator);
                }
            }
            arr.reverse();
            integralPartStringBuffer = arr.join("");
        } else {
            integralPartStringBuffer = fsum.toString();
        }
        return integralPartStringBuffer + decimalSeparator + formatNumber(rsum2digits, 2);
    };

    //format timezone offset to s99:99 pattern
    var formatTimezoneOffset = window.formatTimezoneOffset = function (timezoneOffset, prefix) {
        if (typeof (timezoneOffset) == undefined) return "Z";

        var
            sign = timezoneOffset < 0 ? "+" : "-",
            hours = Math.floor(Math.abs(timezoneOffset) / 60),
            minutes = timezoneOffset % 60;

        return (prefix || '') + sign + formatNumber(hours, 2) + ":" + formatNumber(minutes, 2);
    };

    //convert date to wcf web service style date parameter
    var dateToWCF = window.dateToWCF = function (date) {
        return "\/Date(" + dateToMT(date) + ')\/';
    };

    //convert date to iso 8601 style
    var dateToISO8601 = window.dateToISO8601 = function (date, mode) {
        mode = mode ? mode : "dtz";
        var
            s = "",
            formatNumber = function (num, digits) {
                var numText = num.toString();
                if (numText.length >= digits) return numText;

                var s = "", shift = digits - numText.length;
                for (var i = 0; i < shift; i++) {
                    s += "0";
                }
                return s + numText;
            };

        var includeDate = mode.indexOf("d") !== -1,
            includeTime = mode.indexOf("t") !== -1,
            includeTimeZone = mode.indexOf("z") !== -1;
        if (includeDate) {
            s += formatNumber(date.getFullYear(), 4);
            s += "-";
            s += formatNumber(date.getMonth() + 1, 2);
            s += "-";
            s += formatNumber(date.getDate(), 2);
            if (includeTime) s += "T";
        }

        if (includeTime) {
            s += formatNumber(date.getHours(), 2);
            s += ":";
            s += formatNumber(date.getMinutes(), 2);
            s += ":";
            s += formatNumber(date.getSeconds(), 2);
            s += ".";
            s += formatNumber(date.getMilliseconds(), 3);
        }
        if (includeTimeZone) {
            s += formatTimezoneOffset(date.getTimezoneOffset());
        }
        return s;
    };

    //formats date like milliseconds+timezone
    var dateToMT = window.dateToMT = function (date) {
        var milliseconds = date.getTime(),
            timezoneOffset = date.getTimezoneOffset(),
            timezoneOffsetStr = timezoneOffset > 0 ? "+" + timezoneOffset : timezoneOffset;
        return milliseconds.toString().concat(timezoneOffsetStr);
    };


    //format a date using specified format
    var formatDate = window.formatDate = function (date, format) {
        var
            day = date.getDate(),
            dayOfWeek = date.getDay(),
            month = date.getMonth() + 1,
            year = date.getFullYear(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds(),
            milliseconds = date.getMilliseconds(),
            timeZone = date.getTimezoneOffset(),

            fill = function (num, size) {
                var s = "";
                for (var i = 0; i < size - num.toString().length; i++) s += "0";
                return s + num.toString();
            },

            timeZoneSign = timeZone < 0 ? "-" : "+",
            timeZoneHours = Math.floor(Math.abs(timeZone) / 60),
            timeZoneMinutes = Math.abs(timeZone) % 60,

            clearDate = new Date(year, 0, 1),
            dayOfYear = Math.floor((date.getTime() - clearDate.getTime()) / (1000 * 60 * 60 * 24)),
            s = format,
            replace = String.prototype.replace,
            reduceS = function (pattern, fillResult) {
                s = replace.call(s, pattern, fillResult);
                return reduceS;
            };

        timeZone = timeZoneSign + fill(timeZoneHours, 2) + ":" + fill(timeZoneMinutes, 2);
        reduceS
            (/yyyy/g, year)
            (/yy/g, year % 100)
            (/dd/g, fill(day, 2))
            (/d/g, day)
            (/MM/g, fill(month, 2))
            (/HH/g, fill(hours, 2))
            (/H/g, hours)
            (/mm/g, fill(minutes, 2))
            (/m/g, minutes)
            (/ss/g, fill(seconds, 2))
            (/s/g, seconds)
            (/SSS/g, fill(milliseconds, 3))
            (/SS/g, fill(milliseconds, 2))
            (/S/g, milliseconds)
            (/www/g, fill(dayOfWeek, 3))
            (/ww/g, fill(dayOfWeek, 2))
            (/w/g, dayOfWeek)

            (/jjj/g, fill(dayOfYear, 3))
            (/jj/g, fill(dayOfYear, 2))
            (/j/g, dayOfYear)

            (/TZ/g, timeZone);
        return s;
    };


    // Parse date from ru style
    parseRuDate = function (dateText) {
        var tokens = (dateText.length > 10 ? dateText.substr(0, 10) : dateText).split("."),
            year = parseInt(tokens[2]),
            month = parseInt(tokens[1]) - 1,
            day = parseInt(tokens[0]);

        return new Date(year, month, day);
    };

    var reSlashDate = /\/Date\(([0-9+-]+)\)\//;

    //parse date like /Date(...)/
    parseDateSlashDate = function (dateText) {
        var milliseconds = dateText.replace(reSlashDate, "$1");
        var date = new Date(parseInt(milliseconds));
        return date;
    };

    parseDateJson = function (dateJson) {
        if (dateJson.getTime)
            return dateJson;
        if (reSlashDate.test(dateJson)) {
            return parseDateSlashDate(dateJson);
        } else {
            return parseDateISO8601(dateJson);
        }
    };

    //parse a date in the ISO8601 format
    parseDateISO8601 = function (text) {
        var
            parseDate = function (matches) {
                var
                    year = matches[0],
                    month = matches[1] - 1,
                    day = matches[2];

                return new Date(year, month, day);
            },

            DateParser = {
                parseDate: function (text) {
                    var matches = text.split("-");
                },
                parseTime: function (text) { }
            };

        if (text.indexOf("T") != -1) {
            var
                matches = text.split("T"),
                dateMatches = matches[0].split("-"),
                date = parseDate(dateMatches),
                timeMatches = matches[1].split(":"),
                hours = timeMatches[0],
                minutes = timeMatches[1],
                secondsPart = timeMatches[2];

            var timezoneNum = 0;

            date.setHours(hours);
            date.setMinutes(minutes);
            if (secondsPart.indexOf("Z") !== -1 || secondsPart.indexOf("z") !== -1) {
                secondsPart = secondsPart.substr(0, secondsPart.length - 1);
            }
            if (secondsPart.indexOf("-") !== -1 || secondsPart.indexOf("+") !== -1) {
                var partsWithTimeZone = null;
                if (secondsPart.indexOf("+") !== -1) {
                    partsWithTimeZone = secondsPart.split("+");
                }
                if (secondsPart.indexOf("-") !== -1) {
                    partsWithTimeZone = secondsPart.split("-");
                }
                secondsPart = partsWithTimeZone[0];
                var timezonePart = partsWithTimeZone[1];
            }
            if (secondsPart.indexOf(".") !== -1) {
                var
                    secondsMatches = secondsPart.split("."),
                    seconds = secondsMatches[0],
                    milliseconds = secondsMatches[1];

                date.setSeconds(seconds);
                date.setMilliseconds(milliseconds);
            } else {
                var seconds = secondsPart;
                date.setSeconds(seconds);
            }
            return date;
        } else {
            if (text.indexOf("-") === -1) {
                throw new Error("Invalid input text!");
            } else {
                var matches = text.split("-");
                return parseDate(matches);
            }
        }
    };

    var strReplaceAll = window.strReplaceAll = function (str, oldSubstr, newSubstr) {
        var newStr = str != null ? str.toString() : "";
        while (newStr.indexOf(oldSubstr) !== -1) {
            newStr = newStr.replace(oldSubstr, newSubstr);
        }
        return newStr;
    };

    var getWebSiteURL = window.getWebSiteURL = function () {
        return location.protocol + "//" + location.hostname + (location.port == 80 ? "" : (":" + location.port));
    };

    var extractWebSiteDomainFromURL = window.extractWebSiteDomainFromURL = function (url) {
        var urlSchemeLess = url.substr(url.indexOf("/") + 2);
        var domain = "";
        if (urlSchemeLess.indexOf("/") === -1) {
            domain = urlSchemeLess;
        } else {
            domain = urlSchemeLess.substr(0, urlSchemeLess.indexOf("/"));
        }
        return domain;
    };
})(window);