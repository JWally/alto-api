var utilities = require("./utilities");

// ********************************************************************
// GET INFO
// --------------------------------------------------------------------
// Return information about the vehicle - 
// Must logged in to see this information...
//
// ********************************************************************
exports.get_info = function (req, res) {
	if(!global.database.vehicles[req.params.vehicle_id]){
		return utilities.fail(req, res, 404);
	} else {
		return res.status(200).send(global.database.vehicles[req.params.vehicle_id]);
	}
}