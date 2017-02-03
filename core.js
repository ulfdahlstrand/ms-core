var express = require("express");
var bodyParser = require("body-parser");
var passport = require("./passport.js")
var cors = require('cors');

var App = {
	Express: {},
	Server: {},
	init: function(config) {

		App.Express = express();

		App.Express.use(cors());
		App.Express.use(bodyParser.urlencoded());
		App.Express.use(bodyParser.json());

		if(config.enableSecurity){
			App.Express.use(passport.initialize());
			App.Express.use(passport.authenticate('jwt', { session: false}));
		}

		require("./core-api/routes")();

		App.Server = App.Express.listen(process.env.PORT || config.port, function() {
		    console.log("Listening on port %d", App.Server.address().port);
		});
	}
};

module.exports = App;
