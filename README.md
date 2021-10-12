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

3. put the server on a nodemon instance
```
npm start
```

# route listing

### ```/validate/:user_id``` ( validate user )

_REQUEST_
- Purpose: Validate a user and log them in.
- Method: POST
- Params: (x-www-form-urlencoded)
- - "password" (here it's the user's first name)
- curl -c cookie.txt --data-urlencode "password=eric" -X POST http://localhost:1234/authentication/eric.cartman@gmail.com

_RESPONSE_
- Body: User Data *less* password info
- Headers: Signed cookies required for each request going forward


### ```/user/:user_id``` ( get user data )

_REQUEST_
- Purpose: Get info about a user so they can create a trip request
- Method: GET
- curl -b cookie.txt http://localhost:1234/user/eric.cartman@gmail.com

_RESPONSE_
- Body: User Data *less* password info


### ```/driver/:driver_id``` ( get driver data )

_REQUEST_
- Purpose: Get info about a driver (typically as follow up to trip info)
- Method: GET
- curl -b cookie.txt http://localhost:1234/driver/lianne.cartman@ridealto.com 

_RESPONSE_
- Body: All Driver Data


### ```/vehicle/:vehicle_id``` ( get vehicle data )

_REQUEST_
- Purpose: Get info about a vehicle (typically as follow up to trip info)
- Method: GET
- curl -b cookie.txt http://localhost:1234/vehicle/000001

_RESPONSE_
- Body: All vehicle Data


### ```/trip/:user_id``` ( create trip for user )

_REQUEST_
- Purpose: Create a trip for a user.
- Method: POST
- Params: (x-www-form-urlencoded)
- - "location-to"
- - "location-from"
- - "passenger-count"
- - "payment-method-id"
- curl -b cookie.txt --data-urlencode "location-to=to" --data-urlencode "location-from=here" --data-urlencode "passenger-count=8" --data-urlencode "payment-method=1" -X POST http://localhost:1234/trip/eric.cartman@gmail.com
 

_RESPONSE_
- Body: The newly created trip-object / record
- - which contains the driver's ID and the
- - vehicle's ID



### ```/trip/:user_id/:trip_request_time``` ( get trip information )

_REQUEST_
- Purpose: Gets trip data based on the compound-id of
- - user's ID
- - the time the request was created
- Method: GET
- curl -b cookie.txt http://localhost:1234/trip/eric.cartman@gmail.com/1634033634102 (n.b. this time will be different if you try to replicate based on when you create the record)

_RESPONSE_
- Body: The newly created trip-object / record
- - which contains the driver's ID and the
- - vehicle's ID



### ```/trip/:user_id/:trip_request_time``` ( update trip information )

_REQUEST_
- Purpose: Update a trip's information with the following:
- - user's ID
- - the time the request was created
- Method: PUT
- Params: (x-www-form-urlencoded) - for the demo, anything goes. It'll update it or add whatever you supply.
- curl -b cookie.txt --data-urlencode "vehicle-vibe=old-school" -X PUT http://localhost:1234/trip/eric.cartman@gmail.com/1634033634102

_RESPONSE_
- Body: The newly updated trip-object / record
- - which contains the driver's ID and the
- - vehicle's ID



### ```/trip/:user_id/:trip_request_time``` ( cancel trip )

_REQUEST_
- Purpose: Cancel trip data based on the compound-id of
- - user's ID
- - the time the request was created
- Method: DELETE
- curl -b cookie.txt http://localhost:1234/trip/eric.cartman@gmail.com/1634033634102

_RESPONSE_
- Body: The newly cancelled trip-object / record
- - which contains the driver's ID and the
- - vehicle's ID
- curl -b cookie.txt -X DELETE http://localhost:1234/trip/eric.cartman@gmail.com/1634033634102
