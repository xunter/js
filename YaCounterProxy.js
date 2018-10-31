(function (window) {
	var _yaCounter = null;
	var _yaCounterNum = null;

function resolveYaCounter() {
                         if (_yaCounter == null) {
	for (var yaCounter in window) {
		if (yaCounter != "yaCounterProxy" && yaCounter.indexOf("yaCounter") === 0) {
			_yaCounter = window[yaCounter];
			_yaCounterNum = parseInt(yaCounter.substr("yaCounter".length));
			console.log("yaCounter num = " + _yaCounterNum);
			break;
		}
	}
	}
}

    function invokeYaCounterMethod(method, args) {
	
        if (_yaCounter) {
            var yaCounter = _yaCounter;
            if (yaCounter[method]) {
                yaCounter[method].apply(yaCounter, args);
            }
        }
    };

    var yaCounterProxy = window.yaCounterProxy = {
        reachGoal: function () {
		resolveYaCounter();
            invokeYaCounterMethod("reachGoal", arguments);
		console.log("yaCounter reachGoal "+arguments[0]+ (arguments.length > 1 ? (" " + arguments[1]) : ""));
        },
        getCounterNum: function () {
		resolveYaCounter();
            return _yaCounterNum;
        }

    };
})(window)