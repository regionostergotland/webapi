const DB_VALUES = ['personNumber', 'startDate', 'startJob', 'startCode',
	'stopDate',	'stopJob', 'stopCode', 'svfType'];

module.exports = {
	// Addes the min max values to the sequelize JSON object
	addLessOrGreater: function(sequelizeObject, argsFromGet) {
		// This code adds the 'LIKE' in the where statment.
		// Check if the min/max is in the get request
		if (argsFromGet.minStartDate) {
			// If the statment is not existing create a empty json
			if (!sequelizeObject.where.startDate) {
				sequelizeObject.where.startDate = {};
			}
			 // Add the 'LIKE' in the where statment.
			sequelizeObject.where.startDate.$gte = argsFromGet.minStartDate;
		}
		if (argsFromGet.minStopDate) {
			if (!sequelizeObject.where.stopDate) {
				sequelizeObject.where.stopDate = {};
			}
			sequelizeObject.where.stopDate.$gte = argsFromGet.minStopDate;
		}
		if (argsFromGet.maxStartDate) {
			if (!sequelizeObject.where.startDate) {
				sequelizeObject.where.startDate = {};
			}
			sequelizeObject.where.startDate.$lte = argsFromGet.maxStartDate;
		}
		if (argsFromGet.maxStopDate) {
			if (!sequelizeObject.where.stopDate) {
				sequelizeObject.where.stopDate = {};
			}
			sequelizeObject.where.stopDate.$lte = argsFromGet.maxStopDate;
		}
		return sequelizeObject.where;
	},

	// Make a list of all values to select in from the db, if empty select all
	addFilter: function(sequelizeObject, argsFromGet) {
		if (!argsFromGet.filter) { // Check if filter is set
			return; // No filter
		}
		sequelizeObject.attributes = [];
		var values = argsFromGet.filter.split(',');
		for (var i = 0; i < values.length; i++) { // Loop over values
			// Check if value is valid value
			if (DB_VALUES.indexOf(values[i]) > -1) {
				sequelizeObject.attributes.push(values[i]);
			}
		}
		// if now filters where added remove the list
		if (sequelizeObject.attributes.length === 0) {
			delete sequelizeObject.attributes;
		}

	},


	// Addes the WEHERE statment for the db. Ignores 'LIKE' statment
	addWhereValues: function(sequelizeObject, argsFromGet) {
		values = [argsFromGet.personNumber, argsFromGet.startDate,
			argsFromGet.startJob, argsFromGet.startCode, argsFromGet.stopDate,
			argsFromGet.stopJob, argsFromGet.stopCode, argsFromGet.svfType];

		sequelizeObject.where = {};
		if (values.length !== DB_VALUES.length) {
			 throw new Error('List not same length');
		}
		for (var i = 0; i < values.length; i++) {
			currentValue = values[i];
			if (!currentValue) {
				continue; // If value is undefined
			}
			// Add 'normal' where statments
			if (currentValue.indexOf('%') === -1) {
				sequelizeObject.where[DB_VALUES[i]] = currentValue;
			}
			// Add LIKE where statments
			else {
				sequelizeObject.where[DB_VALUES[i]] = {$like: currentValue};
			}

		}
	},

	addSort: function(sequelizeObject, argsFromGet) {
		sortValue = argsFromGet.sort;
		// Nothing to add
		if (!sortValue) {
			return;
		}

		 // If sort values exist add the sort value
		if (DB_VALUES.indexOf(sortValue) !== -1) {
			sequelizeObject.order = [[sortValue]];
			return;
		}

		// If sort values exist add the sort value with descending
		endsWithD = (sortValue.slice(-1) === 'D');
		sortValue = sortValue.substr(0, sortValue.length - 1);
		if (endsWithD && DB_VALUES.indexOf(sortValue) !== -1) {
			sequelizeObject.order = [[sortValue, 'DESC']];
		}
	},

};
