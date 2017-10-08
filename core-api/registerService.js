var request = require("superagent");

var register = function(config){
  if(config.pulse && config.pulse.shouldRegister && config.pulse.communicatorUrl){
    var body = {
      "name": config.pulse.serviceName,
      "message":"PULSE",
      "scope":"*",
      "path": config.pulse.path
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
};

module.exports = register;
