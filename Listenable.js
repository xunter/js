//Listenable v 1.0
!function (_Listenable) {
    _Listenable = Listenable = function () {
        this._listeners = [];
    }

    _Listenable.prototype = {
        "_forEachListener": function (iterator) {

            var 
                currListener = null,
                tempListeners = clone(this._listeners).reverse(),
                index = 0;

            while ((currListener = tempListeners.pop())) {
                var context = {
                    "listener": currListener,
                    "index": index++,
                    "cancel": false
                };
                iterator.call(this, context);
                if (context.cancel === true) {
                    break;
                }
            }
        },

        contains: function (listener) {
            return this.containsListener(listener);
        },
        containsListener: function (listener) {
            var self = this;
            var containsResult = false;
            this._forEachListener(function (ctx) {
                if (self.areListenersEqual(ctx.listener, listener)) {
                    containsResult = true;
                }
            });
            return containsResult;
        },

        _createListenerForHandler: function (eventName, async, handler) {
            var listener = { state: eventName, async: async };
            listener[eventName] = handler;
            return listener;
        },

        addAsyncHandler: function (eventName, handler) {
            var listener = this._createListenerForHandler(eventName, true, handler);
            this.addListener(listener);
        },

        addHandler: function (eventName, handler) {
            var listener = this._createListenerForHandler(eventName, false, handler);
            this.addListener(listener);
        },

        majorListener: function (listener) {
            listener.isMajor = true;
            return this.addListener(listener);
        },

        majorSingleListener: function (listener) {
            listener.isMajor = true;
            listener.isSingle = true;
            return this.addListener(listener);
        },

        addMajorHandler: function (eventName, handler) {
            var listener = this._createListenerForHandler(eventName, false, handler);
            this.majorListener(listener);
        },

        addMajorSingleHandler: function (eventName, handler) {
            var listener = this._createListenerForHandler(eventName, false, handler);
            this.majorSingleListener(listener);
        },

        singleHandler: function (eventName, handler) {
            this.addOnceHandler(eventName, handler);
        },

        addOnceHandler: function (eventName, handler) {
            var listener = this._createListenerForHandler(eventName, false, handler);
            this.singleListener(listener);
        },

        addOnceAsyncHandler: function (eventName, handler) {
            var listener = this._createListenerForHandler(eventName, true, handler);
            this.singleListener(listener);
        },

        removeHandler: function (eventName, handler) {
            this._forEachListener(function (ctx) {
                var listener = ctx.listener;
                if (typeof (listener[eventName]) != "undefined" && listener[eventName] === handler) this.removeListener(listener);
            });
        },

        "addListener": function (listener) {
            if (!listener._id) {
                listener._id = Listener.createUniqueListenerIdentifier();
            }
            if (!this.contains(listener)) {
                this._listeners.push(listener);
            }
            return this;
        },

        "singleListener": function (listener) {
            listener.isSingle = true;
            return this.addListener(listener);
        },

        "once": function (listener) {
            return this.singleListener(listener);
        },

        areListenersEqual: function (left, right) {
            return Listener.areEqual(left, right);
        },

        "removeListener": function (listener) {
            var self = this;
            var delIndex = -1;
            this._forEachListener(function (ctx) {
                if (self.areListenersEqual(ctx.listener, listener)) {
                    delIndex = ctx.index;
                }
            });
            if (delIndex > -1) {
                this._listeners.splice(delIndex, 1);
            }
            return delIndex;
        },
        "notifyListeners": function (context) {
            var 
                self = this,
                state = context ? context.state : "_",
                listeners = this._listeners,
                currIndex = 0,
                counterTrigger = 0,
                triggerCompletedIfAsync = function (context) {
                    if (context.async) {
                        if (context.callback) {
                            context.callback();
                        }
                    }
                },
                iterateListenerRec = function () {
                    if (currIndex == listeners.length) {
                        triggerCompletedIfAsync(context);
                        return;
                    }
                    var 
                        listener = listeners[currIndex],
                        removeListenerIfSingle = function (listener) {
                            if (listener && listener.isSingle) {
                                var indexRemoved = self.removeListener(listener);
                                return true;
                            }
                            return false;
                        },
                        listenerHandler = listener.getHandler ? listener.getHandler() : listener,
                        handled = false,
                        stateHandlerExists = typeof (listenerHandler[state]) != "undefined",
                        generalHandlerExists = typeof (listener["objectChanged"]) == "function",
                        handlerConsumesPlainArgs = context.hasOwnProperty("__args"),
                        iterateNextListener = function () {

                            var currListener = listeners[currIndex];

                            currIndex++;
                            if (handled && removeListenerIfSingle(currListener)) {
                                currIndex--;
                            }

                            if (currIndex < listeners.length) {
                                iterateListenerRec();
                            } else if (currIndex == listeners.length) {
                                triggerCompletedIfAsync(context);
                            }
                        },
                        triggerStateHandler = function (handlerContext) {
                            handlerContext = handlerContext ? handlerContext : listenerHandler;
                            var listenerHandlerFunc = listenerHandler[state];
                            var returnHandlerVal = null;
                            if (handlerConsumesPlainArgs) {
                                returnHandlerVal = listenerHandlerFunc.apply(handlerContext, context.__args);
                            } else {
                                returnHandlerVal = listenerHandlerFunc.call(handlerContext, context);
                            }
                            return returnHandlerVal;
                        },
                        triggerGeneralHandler = function () {
                            var returnHandlerVal = listener["objectChanged"](context);
                            return returnHandlerVal;
                        };

                    var returnHandlerVal = null;
                    if (listener.async) {
                        var asyncContext = {
                            _completed: false,
                            complete: function () {
                                if (this._completed == false) {
                                    this._completed = true;
                                    handled = true;
                                    if (returnHandlerVal === false) {
                                        triggerCompletedIfAsync(context);
                                    } else {
                                        iterateNextListener();                                    
                                    }
                                }
                            }
                        };
                        if (stateHandlerExists) {
                            counterTrigger++;
                            returnHandlerVal = triggerStateHandler(asyncContext);
                        } else if (generalHandlerExists) {
                            counterTrigger++;
                            returnHandlerVal = triggerGeneralHandler();
                        } else {
                            iterateNextListener();
                        }

                    } else {
                        if (stateHandlerExists) {
                            counterTrigger++;
                            returnHandlerVal = triggerStateHandler();
                            handled = true;
                        } else if (generalHandlerExists) {
                            counterTrigger++;
                            returnHandlerVal = triggerGeneralHandler();
                            handled = true;
                        }

                        if (returnHandlerVal !== false) {
                            iterateNextListener();
                        }
                    }
                };

            iterateListenerRec();
            return self;
        },

        notify: function (eventName) {
            var ctx = {};
            if (arguments.length > 1) ctx.__args = Array.prototype.slice.call(arguments, 1);
            ctx.state = eventName;
            this.notifyListeners(ctx);
        }
    };

    _Listenable.createNew = function () { return new _Listenable() };
} ();