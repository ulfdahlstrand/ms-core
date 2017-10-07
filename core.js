var express = require("express");
var bodyParser = require("body-parser");
var passport = require("./passport.js")
var cors = require('cors');
var request = require("superagent");

var App = {
	Express: {},
	Server: {},
	init: function(config) {

		App.Express = express();

		App.Express.use(cors({
			origin: config.origin || true,
			credentials: config.credentials || true,
		}));

		App.Express.use(bodyParser.urlencoded());
		App.Express.use(bodyParser.json());

		if(config.enableSecurity){
			App.Express.use(passport.initialize());
			App.Express.use(passport.authenticate('jwt', { session: false}));
		}

		if(config.pulse && config.pulse.shouldRegister && config.pulse.serviceUrl && config.pulse.communicatorUrl){
			var body = {
				"name": config.pulse.serviceName,
				"message":"PULSE",
				"scope":"*",
				"url": config.pulse.serviceUrl
			};

			request
				 .post(config.pulse.communicatorUrl)
				 .send(body)
				 .set('Authorization', config.pulse.token)
				 .end(function(err, response){
						if (err || !response.ok) {
							console.log("Failed to register service to " + config.pulse.serviceUrl);
						}
						else {
							console.log("Register service succeeded to " + config.pulse.serviceUrl);
						}
					});
		}

		require("./core-api/routes")();

		App.Server = App.Express.listen(process.env.PORT || config.port, function() {
		    console.log("Listening on port %d", App.Server.address().port);
		});
	}
};

module.exports = App;
