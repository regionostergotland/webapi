var Sequelize = require('sequelize');
var Config = require('../config')

var sequelize;
var database;

const SEQ_SETTINGS = {
	host: config.db.host,
	dialect: config.db.dialect,
	define: {
		freezeTableName: true,
		timestamps: false
	},
	pool: {
		max: 5,
		min: 0,
		idle: 10
	}
};
// Define sequelize object to access database content
module.exports = class SequelizeDB {
	startConnection() {
		sequelize = new Sequelize(config.db.table_name, config.db.username,
			config.db.password, SEQ_SETTINGS);
	}

	// Close connection between sequelize object and database
	endConnection() {
		sequelize.close();
	}

	// Check if authentication is valid
	checkConnection() {
		sequelize
			.authenticate()
			.then(function(err) {
				console.log('Connection has been established successfully.');
			})
			.catch(function(err) {
				console.log('Unable to connect to the database:', err);
			});
	}

	// Declare content types for database
	initDatabase() {
		// Functions that removes the time from the dates
		function removeTime(v){
			// Check if value in select, if not return null
			if (this.getDataValue(v) !== undefined){
				return this.getDataValue(v).toISOString().substring(0, 10);
			}
		}

		database = sequelize.define('Person', {
			personId: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			personNumber: {
				type: Sequelize.STRING,
			},
			startDate: {
				type: Sequelize.DATEONLY,
				get: removeTime,
			},
			startJob: {
				type: Sequelize.STRING,
			},
			startCode: {
				type: Sequelize.STRING,
			},
			stopDate: {
				type: Sequelize.DATEONLY,
				get: removeTime,
			},
			stopJob: {
				type: Sequelize.STRING,
			},
			stopCode: {
				type: Sequelize.STRING,
			},
			svfType: {
				type: Sequelize.STRING,
			},
		});
	}

	// Get specific person as json
	getPersonJSON(id, callback) {
		// Function used on successfull db read
		var func = function(res) {
			var string = JSON.stringify(res);
			var json = JSON.parse(string);
			callback(null, json);
		};
		database
			.findOne({
				where: {
					personId: id
				}
			})
			.then(func);
	}

	// Get all persons as json
	getPersonsJSON(callback) {
		// Function used on successfull db read
		var func = function(res) {
			var string = JSON.stringify(res);
			var json = JSON.parse(string);
			callback(null, json);
		};
		database
			.findAll()
			.then(func);
	}

	// Get all persons with the values from person
	// only select the values from selectValues
	getPersonsWhere(callback, sequelizeObject) {
		// Function used on successfull db read
		var func = function(res) {
			var string = JSON.stringify(res);
			var json = JSON.parse(string);
			callback(null, json);
		};
		database
			.findAll(sequelizeObject)
			.then(func);
	}

	// clears all persons in database
	clearAllPersons() {
		database.destroy({
			where: {}
		});
	}
};
