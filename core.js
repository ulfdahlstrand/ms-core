require('dotenv').config();
var express = require("express");
var bodyParser = require("body-parser");
var passport = require("./passport.js")
var cors = require('cors');
var communicator = require("./core-api/messaging");
var App = {
	Express: {},
	Server: {},
	Communicator:{},
	init: function(config) {

		App.Express = express();

		App.Express.use(cors({
			origin: config.origin || true,
			credentials: config.credentials || true,
		}));

		App.Express.use(bodyParser.urlencoded({
		  extended: true
		}));
		App.Express.use(bodyParser.json());

		if(config.enableSecurity){
			App.Express.use(passport.initialize());
			App.Express.use(passport.authenticate('jwt', { session: false}));
		}

		communicator(config, function(communicatorInstance){
			App.Communicator = communicatorInstance;
			if(config.pulse && config.pulse.shouldRegister){
				App.Communicator.register("PULSE", "PULSE", config.service.host, config.pulse.path);
			}
		});

		require("./core-api/routes")();

		App.Server = App.Express.listen(process.env.PORT || config.port, function() {
		    console.log("Listening on port %d", App.Server.address().port);
		});
	}
};

module.exports = App;
