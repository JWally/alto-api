var crypto = require("crypto"),
	that = {"module": this};
	
//
// Error Handler
//
exports.errorHandler = function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}


//
// FAIL
//
// Quick and dirty way to handle failures
// and throw codes...
//
// More useful for apps that render views; but 
// handy here too...
//
exports.fail = function (req, res, code, txt = "") {

        var msg;
        // Lazy Code Reading
        if (code === 403) {
            msg = txt || "403 - Forbidden";
        } else if (code === 404) {
            msg = txt || "404 - Resource Not Found";
        } else {
            msg = code + " " + txt;
        }
        res.status(code).send({
            "error": msg
        });

};


//
// TEST IF USER IS LOGGED IN OR NOT
//
exports.isvalid = function(req, res, fx_success, user){
	
	//
	// Make sure the user has a "user_id" cookie set
	// which tells us they have logged in
	//
	// Also, if the user paramater is true, check that
	// user's "id" given in the URL is the same as what the
	// user provides via their cookies
	//
	
	// If the user doesn't have a user_id, fail them out outright
	if(req.signedCookies.user_id){
		// If we're checking that the user's cookies match the route; do that logic here
		if(user == true){
			if(req.params.user_id !== req.signedCookies.user_id || req.signedCookies.is_admin == true){
				return that.module.fail(req, res, 403);
			} else {
				return fx_success(req, res);			
			}
		} else {
			// We don't care who hits the route as long as they're logged in
			return fx_success(req, res);
		}
	} else {
		return that.module.fail(req, res, 403);
	}
}


//
// VALIDATE
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
exports.validate = function(req, res){
	
	var user = "";
	//
	// First, check that the user exists
	// If not, throw a 404 error
	//
	
	try{
		user = global.gov.get_user(req.params.user_id,true);
	} catch(e){
		return that.module.fail(req, res, e.code, e.message);
	}
	
	//
	// Check that they gave us a password, otherwise 400;
	//
	if(!req.body.password){
		return that.module.fail(req, res, 400, "Bad Request - No Password Supplied");
	}
	
	//
	// Double Check that OUR data structure is correct or throw a 5xx code
	//
	if(!user.password){
		return that.module.fail(req, res, 500, "Something wrong happened on our end");
	}
	
	if(!user.password.salt){
		return that.module.fail(req, res, 500, "Something wrong happened on our end");
	}
	
	if(!user.password.hash){
		return that.module.fail(req, res, 500, "Something wrong happened on our end");
	}
	
	//
	// Check that the password is correct by: MD5(salt + password) === hash
	//
	var hash_test = crypto.createHash('md5')
						.update(user.password.salt + req.body.password)
						.digest("hex");

	//
	// If they fail our test; 403
	//
	if(hash_test !== user.password.hash){
		return that.module.fail(req, res, 403, "Bad Password / User Combination");
	}
	
	//
	// If they've made it this far; set some signed-cookies for 12 hours
	// and return the user's data so it can be used later by the CLIENT
	//
	res.cookie("user_id", user.id, {
		"maxAge": 1000 * 60 * 60 * 12,
		"signed" : true
	});
	
	//
	// Let's send back the user's information; sans their PW stuff
	//
	delete user.password;
	res.status(200).send(user);	
	
}