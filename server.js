var express = require("express");
var app = express();
var mongoose = require("mongoose");
var mainRoutes = require("./routers/mainRoutes.js");

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
        console.log(new Date() + ':Successfully connected to: ' + mongourl);
    }
});

// Application routing
app.use("/", mainRoutes);

app.listen(appconfig.server.port, function()	{
	console.log("Server is running on port - "+ appconfig.server.port)
})