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