var express = require("express");
var router = express.Router();

var reviewController = require('../controllers/reviewController');

router.get("/healthcheck", function(req, res)	{
	res.status(200).send("OK");
});

router.get("/api/all/stats", reviewController.getAllStats);

router.get("/api/:airport/stats", reviewController.getAirportStat);

router.get("/api/:airport/reviews", reviewController.getAirportReviews);

module.exports = router;