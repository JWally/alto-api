
// FOR RENDERING FAILURES
exports.fail = function (req, res, code) {

        var msg;
        // Lazy Code Reading
        if (code === 403) {
            msg = "403 - Forbidden";
        } else if (code === 404) {
            msg = "404 - Resource Not Found";
        } else {
            msg = code;
        }
        res.status(code).send({
            "error": msg
        });

};