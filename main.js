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
															
	
															// -----------------------------------
	var gov = require("./class/Governor");					// This is our state manager (get it?!)
	global.gov = new gov();									// Instantiate it on the global
	gov = undefined;										// Clean it up locally
	
															// -----------------------------------
	var database = reqdir("./data/", {"recurse": true});	// JSON File DB
	global.gov.data_base = database;						// Give the governor a db to work with
	database = undefined;									// Clean up after ourselves



//
// INSTANTIATE EXPRESS AND LOAD MIDDLEWARE / ETC / WHATEVER
//
var app = express();
    
app.set("port", config[env].appPort);                       // This is the port we listen on
app.use(cookieParser("Paw-Patrol-Is-On-A-Roll"));           // For "Secure Cookies" this is what's 
															// used
// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({"extended": true}));

// /////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////
// *************************************************************************************************
// ****************************************      ROUTE LISTING      ********************************
// *************************************************************************************************
// /////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////


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
// - Route: /user/:user_id
// - Headers: Cookies
//
// RESPONSE:
// - Body: User Data *less* Password Info
//
// PURPOSE:
// - Method for the client to get info about the user
//   such as available payment methods, and other historical
//   information
//
app.get("/user/:user_id", (req, res) => {
	routes.utilities.isvalid(req, res, routes.users.get_info, true);
});


// -- --------------------------------------
// GET DRIVER INFORMATION
// -- --------------------------------------
//
// REQUEST: 
// - Method: GET
// - Route: /driver/:driver_id
// - Headers: Cookies
//
// RESPONSE:
// - All Driver Data
//
app.get("/driver/:driver_id", (req, res) => {
	routes.utilities.isvalid(req, res, routes.drivers.get_info);
});


// -- --------------------------------------
// GET VEHICLE INFORMATION
// -- --------------------------------------
//
// REQUEST: 
// - Method: GET
// - Route: /vehicle/:vehicle_id
// - Headers: Cookies
//
// RESPONSE:
// - All Driver Data
//
app.get("/vehicle/:vehicle_id", (req, res) => {
	routes.utilities.isvalid(req, res, routes.vehicles.get_info);
});


// -- --------------------------
// CREATE TRIP
// -- --------------------------
// 
// REQUEST:
// - Method: POST
// - Route: /trip/:user_id
// - Headers: Cookies
// - Params: 
// - - location-to
// - - location-from
// - - passenger-count
// - - payment-method-id
//
// RESPONSE:
// - Body: 
// - - the trip object / record
app.post("/trip/:user_id", function(req, res){
    routes.utilities.isvalid(req, res, routes.trips.create, true);
});



// -- --------------------------
// GET TRIP
// -- --------------------------
// 
// REQUEST:
// - Method: GET
// - Route: /trip/:user_id/:trip_request_time
// - Headers: Cookies
//
// RESPONSE:
// - Body: 
// - - the trip record / Object
app.get("/trip/:user_id/:trip_request_time", function(req, res){
    routes.utilities.isvalid(req, res, routes.trips.get_info, true);
});



// -- --------------------------
// UPDATE TRIP
// -- --------------------------
// 
// REQUEST:
// - Method: PUT
// - Route: /trip/:user_id/:trip_request_time
// - Headers: Cookies
// - Body: Whatever you want!
//
// RESPONSE:
// - Body: 
// - - the trip object / record
app.put("/trip/:user_id/:trip_request_time", function(req, res){
    routes.utilities.isvalid(req, res, routes.trips.update, true);
});


// -- --------------------------
// CANCEL TRIP
// -- --------------------------
// 
// REQUEST:
// - Method: DELETE
// - Route: /trip/:user_id/:trip_request_time
// - Headers: Cookies

//
// RESPONSE:
// - Body: 
// - - the trip object / record
app.delete("/trip/:user_id/:trip_request_time", function(req, res){
    routes.utilities.isvalid(req, res, routes.trips.cancel, true);
});







//
// Fall Through Route - Throw a custom 404 at the user if their method / path don't
// match anything we currently offer...
//
/*
app.get("*", function (req, res) {
    routes.utilities.fail(req, res, 404);
});
*/

app.use((req, res) => {
	routes.utilities.fail(req, res, 404);
})

http.createServer(app).listen(app.get("port"), function () {
    console.log("Environment: ", app.get("env"));
    console.log("Express server listening on port " + app.get("port"));
});