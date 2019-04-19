(function(window) {
		
	function () {};
	
	if (!Date.prototype.toISOString) {
	  (function() {

		function pad(number) {
		  if (number < 10) {
			return '0' + number;
		  }
		  return number;
		}

		Date.prototype.toISOString = function() {
		  return this.getUTCFullYear() +
			'-' + pad(this.getUTCMonth() + 1) +
			'-' + pad(this.getUTCDate()) +
			'T' + pad(this.getUTCHours()) +
			':' + pad(this.getUTCMinutes()) +
			':' + pad(this.getUTCSeconds()) +
			'.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
			'Z';
		};

	  }());
	}
	
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

    //format timezone offset to s99:99 pattern
    var formatTimezoneOffset = window.formatTimezoneOffset = function (timezoneOffset, prefix) {
        if (typeof (timezoneOffset) == undefined) return "Z";

        var
            sign = timezoneOffset < 0 ? "+" : "-",
            hours = Math.floor(Math.abs(timezoneOffset) / 60),
            minutes = timezoneOffset % 60;

        return (prefix || '') + sign + formatNumber(hours, 2) + ":" + formatNumber(minutes, 2);
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
	if (typeof(Date.prototype.toISO8601String) == "undefined") {
		Date.prototype.toISO8601String = function(mode) {
			return dateToISO8601(this, mode);			
		};
	}
})(window)