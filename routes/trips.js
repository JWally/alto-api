var utilities = require("./utilities");
// ********************************************************************
// CREATE
// --------------------------------------------------------------------
// Create a trip holding caveats that issues might arise from:
// -- Not enough drivers
// -- Card Payment issues
// -- Missing or invalid parameters
// 
// Must logged in to see this information...
//
// ********************************************************************

exports.create = function(req, res){

	// Build out an object to hold our response - should we need to send it
	//
	var response = {"user_id": req.params.user_id},
		user = global.gov.get_user(req.params.user_id); 

	// We need to know where they're going to
	if(!req.body["location-to"]){
		return utilities.fail(req, res, 400, "Missing Parameter: 'location-to'");
	} else {
		response["location-to"] = req.body["location-to"];		
	}
	
	// We need to know where they're coming from
	if(!req.body["location-from"]){
		return utilities.fail(req, res, 400, "Missing Parameter: 'location-from'");
	} else {
		response["location-from"] = req.body["location-from"];	
	}

	// How many people do they have?
	if(!req.body["passenger-count"]){
		return utilities.fail(req, res, 400, "Missing Parameter: 'passenger-count'");
	} else {
		response["passenger-count"] = req.body["passenger-count"];		
	}
	
	// What payment method are they using?
	if(!req.body["payment-method"]){
		return utilities.fail(req, res, 400, "Missing Parameter: 'payment-method'");
	} else {	
		// Try to pull the payment method off of the user
		// based on what was supplied by the request...
		var payment_method = user["payment-methods"].filter((method) => {
			return method.id === req.body["payment-method"];
		})[0];
	}
		
	// Make sure the payment method listed is actually on the
	// user
	if(!payment_method){
		return utilities.fail(req, res, 400, "Invalid Parameter: 'payment-method'");
	} else {
		response["payment-method"] = payment_method;		
	}
		
	//
	// If the user has notes / etc, add them here...
	//
	if(req.body["notes"]){
		response["notes"] = req.body.notes;
	}
	
	//
	// This method uses a promise since it might pull from
	// and or push to a bunch of different services (data-bases,
	// maps, payment-checkers, etc) which run slow.
	//
	// The core Function here is running Promises.all
	//
	global.gov.create_trip(response)
		.then((data) => {
			res.status(200).send(data);
		})
		.catch((err) => {
			return utilities.fail(req, res, err.code, err.message);
		});
	

	
}

// ********************************************************************
// GET INFO
// --------------------------------------------------------------------
// Return information about the vehicle - 
// Must logged in to see this information...
//
// ********************************************************************
exports.get_info = function(req, res){
	try{
		return res.send(global.gov.get_trip(req.params.user_id, req.params.trip_request_time));
	} catch(e){
		console.log(e);
		return utilities.fail(req, res, e.code, e.message);
	}
}

// ********************************************************************
// UPDATE
// --------------------------------------------------------------------
// Update information about a trip.
// --- WARNING ---
// What ever you put into the body of the PUT request
// will get loaded onto the request
//
// ********************************************************************
exports.cancel = function(req, res){
	global.gov.update_trip(req.params.user_id, req.params.trip_request_time, {"status": "cancelled"})
		.then((data) => {
			res.status(200).send(data);
		})
		.catch((err) => {
			return utilities.fail(req, res, err.code, err.message);
		});
}

// ********************************************************************
// CANCEL
// --------------------------------------------------------------------
// Cancel a trip by changing its status from "open" to "cancelled"
//
// ********************************************************************
exports.update = function(req, res){
	
	
	global.gov.update_trip(req.params.user_id, req.params.trip_request_time, req.body)
		.then((data) => {
			res.status(200).send(data);
		})
		.catch((err) => {
			return utilities.fail(req, res, err.code, err.message);
		});

}
