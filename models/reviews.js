var mongoose = require('mongoose');

// Defining schema for reviews collection
var reviews = mongoose.Schema({
	airport_name: {type: String, required: true},
	review_data: [{
		link: {type: String},
		title: {type: String},
		author: {type: String},
		author_country: {type: String},
		date: {type: Date},
		content: {},
		experience_airport: {type: String},
	    date_visit: {},
	    type_traveller: {type: String},
	    overall_rating: {},
	    queuing_rating: {},
	    terminal_cleanliness_rating: {},
	    terminal_seating_rating: {},
	    terminal_signs_rating: {},
	    food_beverages_rating: {},
	    airport_shopping_rating: {},
	    wifi_connectivity_rating: {},
	    airport_staff_rating: {},
	    recommended: {type: Number}
	}]
}, {collection:'reviews'});

reviews.index({airport_name:1});

// Upsert operation
// This function creates an airport review if it is not available in collection while importing CSV file.
// If the airport review is already available for an airport name, The function will update the reviews of existing 
// airports during next CSV import.
// @param1: airportName : is the name of the airport
// @param2: data : expects an array of all the review information for an airport name.
// @param3: cb : callback passed from the calling function to recieve the status of the upsert operation
reviews.statics.doUpsert = function(airportName, data, cb)	{
	
	var condition = {"airport_name": airportName};
	
	var updateData = { $set: { review_data: data } };

	var options = { upsert: true };

	this.update(condition, updateData, options, cb);

}

// Aggregation function
// This will return all the airport names with the number of revoews assocaied with it.
// @param1: cb : callback function returning error and data after the query
reviews.statics.getAllStats = function(cb)	{

	this. aggregate([
      {
         $project: {
         	_id:0,
         	airport_name: "$airport_name",
            reviews_count: {$size: "$review_data"}
         }
      },
      {$sort : { reviews_count : -1} }
   ], cb);

}

// Aggregate of a single airport reviews
// This retunrs the total reviews, total recommendations, overall rating of a airport
// @param1 : airportName :  Name of the airport received as a query parameter from URL 
// @param2: cb : call back function returning data or error
reviews.statics.getAirportStat = function(airportName, cb)	{

	this.aggregate([
	    {$match: {"airport_name": airportName} }, 
	    {$unwind: '$review_data'}, 
	    {$group: {
	        _id: "$airport_name", 
	        "average_rating": {$sum: "$review_data.overall_rating" },
	        "total_reviews":{$sum:1},
	        "recommend":{$sum:"$review_data.recommended"}
	    }}
	], cb);

}

// Get all reviews for a selected airport
// This retunrs the overall rating, recommendation, date, author country and content
// @param1 : airportName :  Name of the airport received as a query parameter from URL 
// @param2: cb : call back function returning data or error
reviews.statics.getAirportReviews = function(airportName, cb)	{

	this.find({"airport_name": airportName},
		{
			'review_data.overall_rating':1,
			'review_data.author_country':1, 
			'review_data.date':1, 
			'review_data.recommended':1, 
			'review_data.content':1, 

		}, { sort: { 'review_data.date' : -1 } }, cb);

}

exports.initreviews = mongoose.model('reviews', reviews);