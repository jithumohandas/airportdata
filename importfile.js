var mongoose = require('mongoose');
var Converter = require("csvtojson").Converter;
var converter = new Converter({});

var reviewsModel = require('./models/reviews');
var reviewsModelObj = reviewsModel.initreviews;

var appconfig = require("./conf.json");

// MongoDB database connection options
var mongoOptions = {
    server: {
        auto_reconnect: true,
        poolSize: 10
    }
};

// Connection URL to the DB 
//var mongourl = "mongodb://"+appconfig.mongodb.username+":"+appconfig.mongodb.password+"@"+appconfig.mongodb.host+":"+appconfig.mongodb.port+"/"+appconfig.mongodb.dbname;
var mongourl = "mongodb://"+appconfig.mongodb.host+":"+appconfig.mongodb.port+"/"+appconfig.mongodb.dbname;
// Establish connection to MongoDB 
mongoose.connect(mongourl, mongoOptions, function(err) {
    if(err) {
       console.log(new Date() + ':Error connecting to: ' + mongourl + '. ' + err);
    } else {
        //console.log(new Date() + ':Successfully connected to: ' + mongourl);

        console.log("Processing CSV file air.csv in the current folder.");
        
        require("fs").createReadStream("./air.csv").pipe(converter);
    }
});
 
//end_parsed will be emitted once parsing finished 
converter.on("end_parsed", function (jsonArray) {

	//console.log(jsonArray);

   var airportNames = [];
   var finalObject = {};

   // Creating an array of all airportnames and curresponding JSON object will all review comments
   // airportNames will contain all distinct airport names available in the CSV file
   // finalObject creates a JSON object with key as airportname and value is an array of all reviews available
   // for key airportname from the CSV file.
   for(var i = 0; i < jsonArray.length; i++)
   {
   		if(-1 == airportNames.indexOf(jsonArray[i].airport_name))
   		{

   			airportNames.push(jsonArray[i].airport_name);

   			finalObject[jsonArray[i].airport_name] = [];

   			finalObject[jsonArray[i].airport_name].push(jsonArray[i]);

   		} else {

   			finalObject[jsonArray[i].airport_name].push(jsonArray[i]);

   		}

   		jsonArray[i] = null;

   }

  // Dummy callback function
  function cb()	{ };

  // Each async call will invoke this function
  var insertData = function(airportName, cb)	{

  	reviewsModelObj.doUpsert(airportName, finalObject[airportName], function(err, response) {
		
		if(err)
		{
			console.log("Error in doing upsert operation");
			console.log(err);
		}

		// Callback function to move with next 5 set of data from the airportNames array
		cb();

	});

  };

  console.log("Started importing data to MongoDB. Please wait till the confirmation message.")

  // Using async eachlimit to keep track of the loop completion
  // The process will be exited automatically after inserting all airport reviews to the collection
  // Using DB :- airports , collection :- reviews
  require("async").eachLimit(airportNames, 5, insertData, function(err)	{

  		console.log("Completed importing CSV data to MongoDB successfully.");
  		console.log("To ensure the data availability, please verify DB : "+ appconfig.mongodb.dbname +" ---> Collection : reviews");
   		process.exit(0);

   })

});
 