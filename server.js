var express = require('express');
var config = require('./config');
var app = express();
var cors = require('cors');
var compression = require('compression');

//  Route variables
var personsRoutes = require("./routes/persons");

// Enable cors
app.use(cors());
// compress all responses
app.use(compression());
// API routes
app.use('/persons', personsRoutes);
// Start the server
app.listen(config.port);
console.log('Server started on port: ' + port);
