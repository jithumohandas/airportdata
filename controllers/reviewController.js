var reviewsModelObj = require('../models/reviews').initreviews;

// Controller action for route -> /api/all/stats
// Gathers the airport name and number of reviews from DB
// Sends the data as a JSON response
exports.getAllStats = function(req, res)	{

	reviewsModelObj.getAllStats(function(err, dbData){
		if(err)
		{
			console.log("Error from reviewController -> getAllStats");
			console.log(err);
		}
		else
		{
			res.json(dbData);
		}
	});

}

// Controller action for route -> /api/:airport/stats
// Returns a single airport's stats
// Sends the data as a JSON response
exports.getAirportStat = function(req, res)	{


	reviewsModelObj.getAirportStat(req.params.airport,function(err, dbData){
		if(err)
		{
			console.log("Error from reviewController -> getAirportStat");
			console.log(err);
		}
		else
		{
			if("undefined" != typeof(dbData[0]))
			{
				dbData[0].average_rating = Math.ceil(dbData[0].average_rating / dbData[0].total_reviews);
				res.json(dbData[0]);
			}
			else
			{
				res.json({});
			}
		}
	});

}


// Controller action for route -> /api/:airport/reviews
// Returns selected attributes from all reviews available for a specific airport mentioned in URL.
// Sends the data as a JSON response
exports.getAirportReviews = function(req, res)	{

	reviewsModelObj.getAirportReviews(req.params.airport,function(err, dbData){
		if(err)
		{
			console.log("Error from reviewController -> getAirportReviews");
			console.log(err);
		}
		else
		{
			if("undefined" != typeof(dbData[0]))
			{
				res.json(dbData[0].review_data)
			}
			else
			{
				res.json([]);
			}
		}
	});
}


