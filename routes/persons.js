express = require('express');
var router = express.Router();

var SequelizeDB = require('./../db/sequelize.js');
var parser = require("./../utils/dataParser.js");


var db = new SequelizeDB();
db.startConnection();
db.initDatabase();


router.get("/", function(req, res) {
	// The JSON that define what to get from the DB
	var sequelizeObject = {};
	// Addes the "normal" WEHERE statments, example
	// ... WHERE startCode='VT899'
	parser.addWhereValues(sequelizeObject, req.query);
	// Addes the filter/SELECT statment, example
	// SELECT personNumber ...
	parser.addFilter(sequelizeObject, req.query);
	// Addes the 'LIKE' statment to the WHERE statments, example
	// ... WHERE startCode LIKE 'VT%'
	parser.addLessOrGreater(sequelizeObject, req.query);
	// Addes the order statment
	parser.addSort(sequelizeObject, req.query);
	// Use the JSON to get the values from the DB and return the data
	// to the client
	db.getPersonsWhere(function(error, result) {
		if (error) throw error;
		res.send(result);
	}, sequelizeObject);
});


router.get("/:id", function(req, res) {
	var id = req.params.id;
	console.log("Getting person in database with id: " + id);
	db.getPersonJSON(id, function(error, result) {
		if (error) throw error;
		res.send(result);
	});
});

module.exports = router;
