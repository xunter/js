
module.exports = {
  catchAsyncErr
};

//wrap controller action function to catch error to pass then to next callback for global error handler. 
//It prevents node process crash when new error is thrown in async function execution
function catchAsyncErr(controllerAction) {
    return async function(req, res, next) { 
        try {
            return await controllerAction.apply(this, arguments);
        } catch (err) {
            next(err);
        }
    };
};
