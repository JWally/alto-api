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
// 
// Set a signed-cookie 
// - available payment methods (array of id, and default-or-not)
// - miscellaneous (mood, whatever)
app.post("/authentication/:user_id", routes.utilities.validate);


// -- --------------------------------------
// GET USER-TRIP INFORMATION
// -- --------------------------------------
//
// This is where a user "logs in"
// -- --------------------------------------
// REQUEST: 
// - Route: /validate/:user_id
// - Params: "password"
//
// RESPONSE:
// - Body: User Data *less* Password Info
// - Headers: Signed Cookies that are required
//	 for each requeset going forward...
//
app.get("/users/:user_id", (req, res) => {
	routes.utilities.isvalid(req, res, routes.users.get_info);
});


// -- --------------------------
// CREATE TRIP
// -- --------------------------
// 
// In the body of the POST, we need the following from the user
// - location-from
// - location-to
// - passenger-count
// - payment-method-id

app.post("/trips/:user_id", function(req, res){
    res.status(200).send({"message": "eat me"});
})

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