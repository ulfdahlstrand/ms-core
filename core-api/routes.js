var App = require("./../core");

var baseUrl = "/api"
module.exports = function() {

	App.Express.get( baseUrl + "/health", function (req, res) {
			res.send();
	});
};
