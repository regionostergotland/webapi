var express = require("express");
var app = express();
var port = process.env.PORT || 8080;        // Set port to env-var or 8080
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
app.listen(port);
console.log("Server started on port: " + port);
