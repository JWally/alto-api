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
    routes = reqdir("./routes", {"recurse": true});  //


//
// INSTANTIATE EXPRESS AND LOAD MIDDLEWARE / ETC / WHATEVER
//
var app = express();
    
app.set("port", config[env].appPort);                       // This is the port we listen on
app.use(cookieParser("Magic-Hot-Dogs"));                    // For "Secure Cookies" this is what's 

// parse application/json
app.use(bodyParser.json({limit: "1mb"}));



// /////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////
// *************************************************************************************************
// ****************************************      ROUTE LISTING      ********************************
// *************************************************************************************************
// /////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////

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