var utilities = require("./utilities");

// ********************************************************************
// GET INFO
// --------------------------------------------------------------------
// Return information about the driver - 
// Must logged in to see this information...
//
// ********************************************************************
exports.get_info = function (req, res) {
	try{
		return res.send(global.gov.get_driver(req.params.driver_id));
	} catch(e){
		return utilities.fail(req, res, e.code, e.message);
	}
}