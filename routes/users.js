var utilities = require("./utilities");

// ********************************************************************
// GET INFO
// --------------------------------------------------------------------
// Return information about the user - 
// Must be that user or an admin to see...
//
// ********************************************************************
exports.get_info = function (req, res) {
	//
	// First make sure that the user themselves or someone with an "is_admin" cookie
	// is requesting the data - otherwise fail them
	//
	if(req.params.user_id !== req.signedCookies.user_id || req.params.is_admin == true){
		return utilities.fail(req, res, 403);
	}
	
	//
	// For this exercise we're storing password salt / hash directly on the user.
	// There are better ways, but still it feels wrong sending any password info
	// back to the user; so we're deleting it here...
	// 
	// overkill, probably; 
	//
	var user = JSON.parse(JSON.stringify(global.database.users[req.params.user_id]));
	delete user.password;

	return res.status(200).send(user);
}