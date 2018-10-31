(function () {

    function createUniqueListenerIdentifier() {
        var uniqueString = "Listener";
        var d = new Date();
        uniqueString += "_" + d.getTime();
        var rndNum = Math.random() * 10000;
        uniqueString += "_" + rndNum;
        return uniqueString;
    };

    Listener = function (handler) {
        this._isListenerConstructor = true;
        this._handler = handler;
        this._id = createUniqueListenerIdentifier();
    };

    Listener.prototype = {
        getHandler: function () { return this._handler; },
        objectChanged: function (context) {
            if (typeof (this._handler[context.state]) === "function") {
                this._handler[context.state](context);
            }
        },

        getUniqueKey: function () { return this._id },

        isEqualTo: function (other) {
            return other != null && this._id === other.getUniqueKey();
        }
    };

    Listener.createUniqueListenerIdentifier = createUniqueListenerIdentifier;

    Listener.areEqual = function (left, right) {
        return left != null && right != null && left._id === right._id;
    };
})()
