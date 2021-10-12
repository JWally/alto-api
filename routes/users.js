var utilities = require("./utilities");

// ********************************************************************
// GET INFO
// --------------------------------------------------------------------
// Return information about the user - 
// Must be that user or an admin to see...
//
// ********************************************************************
exports.get_info = function (req, res) {
	try{
		return res.send(global.gov.get_user(req.params.user_id));
	} catch(e){
		return utilities.fail(req, res, e.code, e.message);
	}
}