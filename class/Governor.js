//
//  Thought of this too late, but let's see how
//  far we run with it...
//
//  So this is a class to manage the state of the app
//  ...
//  This might make life a *LOT* easier since we don't have
//  access to a real database for this exercise and we can
//  put all of the yucky logic => data-storage here
//
//  (n.b. in case I forget; governor manage states. ha. ha. ha.)
//
module.exports = class Governor{
	//
	// Private variable to house our database
	// and what not...
	//
	#database;

	//
	// Not really sure we need this...
	// We can keep it here for now, but as of now
	// it adds no value...
	//
	constructor(){
		let that = this;
	}
	
	//
	// Setter for the global database (which might not 
	//   need to be global)
	//
	set #data_base(db){
		this.#database = db;
	}
	
	
	
}