# alto-api
API Mock-Up for ALTO

# what is this
quick demo of a node.js API simulating routes a client might use to
- log in
- get info about themself
- get info about a vehicle
- get info about a driver
- create a trip
- get info about a trip
- update info about a trip
- cancel a trip

# how do I install and run it

1. from your command-line / git client:
```bash
git clone https://github.com/JWally/alto-api.git
```

2. install dependencies
cd into ```alto-api``` and
```bash
npm install
```

3. npm start
this puts the server on nodemon

# route listing

### ```/validate/:user_id``` ( validate user )

_REQUEST_
- Purpose: Validate a user and log them in.
- Method: POST
- Body: "password" (here it's the user's first name)

_RESPONSE_
- Body: User Data *less* password info
- Headers: Signed cookies required for each request going forward


# what do I do with it

This is a simulation of what a user might need to CRUD a trip.
For whatever reason, when I wrote this I had South-Park on the brain,
so the four user options you have to chose from are:

- eric.cartman@gmail.com
- stan.marsh@gmail.com
- kyle.broflovski@gmail.com
- kenny.mccormick@aol.com


__LOG IN__
To get credentials to move around the API as a user, you need to log-in
first.

The following route fulfills that function:
```/authentication/:user_id```

where ```:user_id``` is one of the e-mails listed above (case sensitive)
