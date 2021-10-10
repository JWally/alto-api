var utilities = require("./utilities");

// ********************************************************************
// GET INFO
// --------------------------------------------------------------------
// Return information about the driver - 
// Must logged in to see this information...
//
// ********************************************************************
exports.get_info = function (req, res) {
	if(!global.database.drivers[req.params.driver_id]){
		return utilities.fail(req, res, 404);
	} else {
		return res.status(200).send(global.database.drivers[req.params.driver_id]);
	}
}