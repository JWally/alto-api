// /////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////
// *************************************************************************************************
// ****************************************   DESCRIPTION    ***************************************
// *************************************************************************************************
// /////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////
/*
	The process flow would look like this:
	
	1.) The client logs in via the API
	
	2.) The API returns user information to the client
		so that they can create a trip
		
	3.) The user tells the API to create a trip

	4.) The API hits services to:
		- Find a driver
		- Find a vehicle
		- Calculate a time-estimate
		- Calculate a cost-estimate
		
	5.) The user can get driver information 
	
	6.) The user then MUST update the trip to approve it




*/












// /////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////
// *************************************************************************************************
// ****************************************      SET UP      ***************************************
// *************************************************************************************************
// /////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////


//
// SET THE "env" VARIABLE BASED ON SYSTEM-VARIABLES *OR* DEFAULT TO DEV
// (This drives config settings later)
//
var env = process.env.NODE_ENV || "dev";


//
// THIS SECTION PULLS IN ALL OF THE REQUIRED LIBRARIES
// FILES, ETC TO MAKE THIS WORK...
//
var http = require("http"),
    path = require("path"),
    express = require("express"),
    reqdir = require("require-dir"),
    config = require("./config.json"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    routes = reqdir("./routes", {"recurse": true});         // This allows me to organize code - 
                                                            // by storing modules under "./routes"
                                                            // and accessing those modules here 
                                                            // through the object "routes"
                                                            // I can structure code in a way that
                                                            // makes sense to me...
															
															
	global.database = reqdir("./data/", {"recurse": true});


//
// INSTANTIATE EXPRESS AND LOAD MIDDLEWARE / ETC / WHATEVER
//
var app = express();
    
app.set("port", config[env].appPort);                       // This is the port we listen on
app.use(cookieParser("Paw-Patrol-Is-On-A-Roll"));           // For "Secure Cookies" this is what's 

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({"extended": true}));

// rinky-dink error handler (https://expressjs.com/en/guide/error-handling.html)
app.use(routes.utilities.errorHandler);


// /////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////
// *************************************************************************************************
// ****************************************      ROUTE LISTING      ********************************
// *************************************************************************************************
// /////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////



//
// For brevity / getting work done, let's assume the following:
//
// 1.) There already exist ways to CRUD
//     - users
//     - drivers
//     - vehicles
//
//
// 2.) *MY OBJECTIVE* then is to build out routing for trips (calling it "routes" would be confusing)
//     - Create a trip
//     - Update a trip
//     - Get a trip
//     - Cancel a trip
//
//
// 3.) 
//

// -- --------------------------
// AUTHENTICATION
// -- --------------------------
// This is where a user "logs in"
// -- --------------------------------------
//
//
// REQUEST: 
// - Method: POST
// - Route: /validate/:user_id
// - Params: "password"
//
// RESPONSE:
// - Body: User Data *less* Password Info
// - Headers: Signed Cookies that are required
//	 for each requeset going forward...
//
app.post("/authentication/:user_id", routes.utilities.validate);


// -- --------------------------------------
// GET USER INFORMATION
// -- --------------------------------------
//
// REQUEST: 
// - Method: GET
// - Route: /users/:user_id
// - Headers: Cookies
//
// RESPONSE:
// - Body: User Data *less* Password Info
//
app.get("/users/:user_id", (req, res) => {
	routes.utilities.isvalid(req, res, routes.users.get_info, true);
});


// -- --------------------------
// CREATE TRIP
// -- --------------------------
// 
// REQUEST:
// - Method: POST
// - Route: /trips/:user_id
// - Headers: Cookies
// - Params: 
// - - location-to
// - - location-from
// - - passenger-count
// - - payment-method-id
//
// RESPONSE:
// - Body: 
// - - trip-id
// - - estimated-time-of-arrival
// - - estimated-fare
// - - location-to
// - - location-from
// - - passenger-count
// - - payment-method-id

app.post("/trips/:user_id", function(req, res){
    routes.utilities.isvalid(req, res, routes.trips.create, true);
});



// -- --------------------------------------
// GET DRIVER INFORMATION
// -- --------------------------------------
//
// REQUEST: 
// - Method: GET
// - Route: /drivers/:driver_id
// - Headers: Cookies
//
// RESPONSE:
// - All Driver Data
//
app.get("/drivers/:driver_id", (req, res) => {
	routes.utilities.isvalid(req, res, routes.drivers.get_info);
});











//
// Fall Through Route - Throw a custom 404 at the user if their method / path don't
// match anything we currently offer...
//
app.get("*", function (req, res) {
    routes.utilities.fail(req, res, 404);
});

http.createServer(app).listen(app.get("port"), function () {
    console.log("Environment: ", app.get("env"));
    console.log("Express server listening on port " + app.get("port"));
});