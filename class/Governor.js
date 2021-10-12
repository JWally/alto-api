var fs = require("fs"),
	path = require("path");
//
//  So this is a class to manage the state of the app
//  ...
//  This might make life a *LOT* easier since we don't have
//  access to a real database for this exercise and we can
//  put all of the yucky logic => data-storage here
//
//  (n.b. in case I forget; governors manage states. ha. ha. ha.)
//
module.exports = class Governor{
	//
	// Private variable to house our database
	// and what not...
	//
	#database;

// ////////////////////////////////////////////////////////////////////
// Generic Class Constructor
// 
// ////////////////////////////////////////////////////////////////////
	constructor(){
		//
		// Every 15 seconds, look for open trips whose ETA is in the
		// past and set their status to closed. Nothing imperative,
		// but makes for a more fun simulation.
		//
		setInterval(() => {
			this.#database_clear_stale_trips();
		}, 5000);
	}
	
// ////////////////////////////////////////////////////////////////////
// Setter for the global database (which might not 
//   need to be global)
// ////////////////////////////////////////////////////////////////////

	set data_base(db){
		this.#database = db;
	}
	
	
// ////////////////////////////////////////////////////////////////////
//
// PUBLIC method to get "user"
// (n.b. this method strips off the user's password info by default
//       but can be recovered by setting the "return_password" method
//		 to true
// )
// ////////////////////////////////////////////////////////////////////

	get_user(id, return_password){
		var that = this;
		//
		// Check that the user exists or thorw an error
		//
		if(this.#database.users[id]){
			//
			// Given the Half-Hearted database, I don't want to pass reference to
			// the user and nuke their password information - so, we're severing it
			// by converting the user-object to a string, then back to an Object
			//
			var user = JSON.parse(JSON.stringify(this.#database.users[id]));
			
			//
			// Even though the password data we keep is just salt and hash
			// we still don't want to leak it what with rainbows and all...
			//
			if(return_password !== true){
				delete user.password;
			}
			return user;
		} else {
			throw {"message": "USER DOES NOT EXIST", "code": 404};
		}
	}
	
	
// ////////////////////////////////////////////////////////////////////
// PUBLIC method to get "user"
// ////////////////////////////////////////////////////////////////////
	get_vehicle(id){
		//
		// Check that the user exists or thorw an error
		//
		if(this.#database.vehicles[id]){
			//
			// We're rolling into and out of a JSON out of paranoia
			// *probably* not necessary; but I don't want to pass something
			// by reference and change it on accident...
			//
			return JSON.parse(JSON.stringify(this.#database.vehicles[id]));
		} else {
			//
			// This is our custom error
			//
			throw {"message": "VEHICLE DOESN'T EXIST", "code": 404}
		}
	}
	

// ////////////////////////////////////////////////////////////////////
// PUBLIC method to get "driver"
// ////////////////////////////////////////////////////////////////////
	get_driver(id){
		//
		// Check that the user exists or thorw an error
		//
		if(this.#database.drivers[id]){
			//
			// We're rolling into and out of a JSON out of paranoia
			// *probably* not necessary; but I don't want to pass something
			// by reference and change it on accident...
			//
			return JSON.parse(JSON.stringify(this.#database.drivers[id]));
		} else {
			//
			// This is our custom error
			//
			throw {"message": "DRIVER DOESN'T EXIST", "code": 404}
		}
	}
	
	
// ////////////////////////////////////////////////////////////////////
// PUBLIC method to make "trip"
// ////////////////////////////////////////////////////////////////////
	create_trip(inputs){

		//
		// 1.) First, get driver, vehicle, and user status
		// as promises
		//
		
		//
		// 2.) If those come back clean, try pushing it into our
		// database
		//
		
		//
		// 3.) If that works, return and render whatever comes out...
		//
		const pDriver = this.#find_trip_driver();
		const pVehicle = this.#find_trip_vehicle();
		const pUser = this.#get_user_trip_status(inputs.user_id);
		
		return Promise.all([pDriver, pVehicle, pUser])
			.then((data) => {
				//
				// Add our new information to the user's request
				//
				inputs.driver_id = data[0];
				inputs.vehicle_id = data[1];
				inputs.request_time = new Date().getTime();
				inputs.trip_eta = inputs.request_time + (1000 * 60 * 5) + Math.random() * 10000;
				inputs.status = "open";
				inputs.fare = Math.random() * 100;
				inputs.map_url = "https://www.maps.google.com?id=" + inputs.trip_eta;
				
				//
				// Try putting it into our database
				//
				return this.#database_insert_trip(inputs);
			})
			.catch((err) => {
				//
				// We have to return a new promise since
				// what we're doing in TRIPS.js is expecting
				// a promise...
				//
				return new Promise((res, rej) => {
					rej(err);
				});
			});

	}


// ////////////////////////////////////////////////////////////////////
// PUBLIC method to fetch a trip's information
// ////////////////////////////////////////////////////////////////////
	get_trip(user_id, trip_request_time){
		//
		// Try and pull the record that was requested
		//
		var data = this.#database.trips.data.filter((trip) => {
			return trip.user_id === user_id && trip.request_time === parseInt(trip_request_time);
		});
		
		//
		// If we didn't find anything, throw a 404
		//
		if(data.length == 0){
			throw {"code": 404, "message": "Trip not found"};
		} else {
			//
			// Otherwise, return the trip record
			//
			return data[0];
		}
	}
	
	
	
// ////////////////////////////////////////////////////////////////////
// PUBLIC method to update a trip in the database

// --- WARNING ---
// --- WARNING ---
// --- WARNING ---

// --- WARNING ---
// --- WARNING ---
// --- WARNING ---

// --- WARNING ---
// --- WARNING ---
// --- WARNING ---

// This method will blindly take whatever a user supplies; and given
// a valid trip record will update or create the fields on the record
// based on whatever the user put in their request-body.
// 
// Clearly bad practice, but you get the point :-)
//
// ////////////////////////////////////////////////////////////////////
	update_trip(user_id, trip_request_time, request_body){
		//
		// Try and pull the record that was requested
		//
		var data = this.#database.trips.data.filter((trip) => {
			return trip.user_id === user_id && trip.request_time === parseInt(trip_request_time) && trip.status === "open";
		});
		
		return new Promise((res, rej) => {
			if(data.length == 0){
				rej({"code": 404, "message": "Trip not found"});
			}
			
			
			//
			// Otherwise, Iterate over the request body
			// and store it to our trip record
			//
			data = data[0];
			
			for(var attr in request_body){
				data[attr] = request_body[attr];
			}
			
			//
			// Write the updates to our trip-database
			//
			var trip_file = path.resolve("./data/trips/data.json");
			fs.writeFile(trip_file, JSON.stringify(this.#database.trips.data,null,"   "), "utf-8", (err) => {
				if(err){
					rej({"code" : 500, "message": "something went wrong"});
				} else {
					res(data);
				}
			})
		})
	}
	
// ////////////////////////////////////////////////////////////////////
// PRIVATE method to find an *OPEN* driver
// ////////////////////////////////////////////////////////////////////
	#find_trip_driver(){
		return new Promise((res, rej) => {

			//
			// Find all drivers who are currently in use
			// so we can eliminate them 
			//
			var used_drivers = this.#database.trips.data.filter((trip) => {
				return trip.status === "open";
			})
			//
			// I want an array of driver's ID's who are in use
			//
			.map((trip) => {
				return trip.driver_id;
			});
			
			// TESTING
			// ..TESTING
			// ....TESTING
			//
//			used_drivers = ["liane.cartman@ridealto.com","veronica.crabtree@ridealto.com"];
			
			//
			// Get all drivers so we can diff 
			// All-Drivers - Used-Drivers = Free-Drivers
			//
			var all_drivers = Object.keys(this.#database.drivers).sort((a,b) => {return Math.random() > Math.random ? -1 : 1});

			//
			// https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
			//
			var free_drivers = all_drivers
				.filter(x => !used_drivers.includes(x))
				
			if(free_drivers.length > 0){
				//
				// No Errors! Yay!
				//
				res(free_drivers[0]);
			} else {
				//
				// Oh No! No Drivers Available
				//
				rej({"code": 503, "message": "No Drivers Currently Available"});
			}
		});
	}
	
	
// ////////////////////////////////////////////////////////////////////
// PRIVATE method to find an *OPEN* vehicle
// ////////////////////////////////////////////////////////////////////
	#find_trip_vehicle(){
		return new Promise((res, rej) => {
			//
			// Find all vehicles who are currently in use
			// so we can eliminate them 
			//
			var used_vehicles = this.#database.trips.data.filter((trip) => {
				return trip.status === "open";
			})
			//
			// I want an array of vehicle's ID's who are in use
			//
			.map((trip) => {
				return trip.vehicle_id;
			});
			
			// TESTING
			// ..TESTING
			// ....TESTING
			//
//			used_vehicles = ["000001","000002","000003"];
			
			//
			// Get all vehicles so we can diff 
			// All-Vehicles - Used-Vehicles = Free-Vehicles
			//
			var all_vehicles = Object.keys(this.#database.vehicles).sort((a,b) => {return Math.random() > Math.random ? -1 : 1});

			//
			// https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
			//
			var free_vehicles = all_vehicles
				.filter(x => !used_vehicles.includes(x))
				
			if(free_vehicles.length > 0){
				//
				// No Errors! Yay!
				//
				res(free_vehicles[0]);
			} else {
				//
				// Oh No! No Vehicles Available
				//
				rej({"code": 503, "message": "No Vehicles Currently Available"});
			}
		});
	}
	
	
// ////////////////////////////////////////////////////////////////////
// PRIVATE method to ensure the USER is not currently on a trip
// ////////////////////////////////////////////////////////////////////
	#get_user_trip_status(user_id){
		return new Promise((res, rej) => {
			
			//
			// Query trips to make sure the current user
			// is not on a trip
			//
			var active_trips = this.#database.trips.data.filter((trip) => {
				return trip.status === "open" && trip.user_id === user_id;
			});
			
			if(active_trips.length !== 0){
				rej({
					"code": 503, 
					"message": "This user is associated with a trip already. Please close it out. " + JSON.stringify(active_trips)
				});
			} else {
				res(true);
			}
			
			
			
		});
	}
	
// ////////////////////////////////////////////////////////////////////
// PRIVATE method to insert trip data into DB
// ////////////////////////////////////////////////////////////////////
	#database_insert_trip(inputs){
		return new Promise((res, rej) => {
			var trip_file = path.resolve("./data/trips/data.json");
			
			//
			// Put the data into RAM, and write
			// to our file...
			//
			this.#database.trips.data.push(inputs);

			//
			// Write it to our database
			//
			fs.writeFile(trip_file, JSON.stringify(this.#database.trips.data,null,"   "), "utf-8", (e) => {
				if(!e){
					res(inputs)
				} else {
					rej({"code": 500, "data": e, "message": "Something Happened..."});
				}
			})
		});
	}
	
// ////////////////////////////////////////////////////////////////////
// PRIVATE method to close-out open trips after their ETA has elapsed
// ////////////////////////////////////////////////////////////////////
	#database_clear_stale_trips(){
		var changes = this.#database.trips.data.filter((trip) => {
			return trip.trip_eta < new Date().getTime() && trip.status === "open";
		});
		
		if(changes.length > 0){
			changes.forEach((trip) => {
				trip.status = "complete";
			});
			
			//
			// Write the updates to our trip-database
			//
			var trip_file = path.resolve("./data/trips/data.json");
			fs.writeFile(trip_file, JSON.stringify(this.#database.trips.data,null,"   "), "utf-8", (e) => {
				if(e){
					throw {"code": 500, "data": e, "message": "Something Happened..."};
				}
			});			
		}
	}
}