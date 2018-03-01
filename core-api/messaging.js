var request = require("superagent");

var init = function(input_config, callback){
  var config = input_config;

  getServiceToken(config,function(servicetoken){
    config.servicetoken = servicetoken;
    var communicatorInstance = {
      config: config,
      register: function(message, scope, host, path) {
        register(message, scope, host, path, config);
      },
      sendMessage: function(message, scope, data, usertoken) {
        sendMessage(message, scope, data, config, usertoken);
      },
    };
    callback(communicatorInstance);
  });
};

var register = function(message, scope, host, path, config){
  console.log("Registering  service for " + message +" and " + scope);
  var communicator = config.communicator;
  var service = config.service;
  if(communicator && communicator.path && config.servicetoken && service && service.name){
    var body = {
      "name": service.name,
      "message": message,
      "scope": scope,
      "host": host,
      "path": path
    };

    var url = config.communicator.path + "/communicator/listener";
    request
       .post(url)
       .send(body)
       .set('Authorization', "JWT " + config.servicetoken)
       .end(function(err, response){
          if (err || !response.ok) {
            console.log("Failed to register service to " + url);
            console.log(err)
          }
          else {
            console.log("Register service succeeded to " + url);
          }
    });
  }
};

var sendMessage = function(message, scope, data, config, usertoken){
  console.log("Sending message");
  var communicator = config.communicator;
  var service = config.service;
  var authToken = usertoken ? usertoken : config.servicetoken;
  if(communicator && communicator.path && authToken && service && service.name){
    var body = {
      "name": service.name,
      "message":message,
      "scope":scope,
      "data":data
    };
    var url = config.communicator.path + "/communicator/message";
    request
       .post(url)
       .send(body)
       .set('Authorization', "JWT " + authToken)
       .end(function(err, response){
          if (err || !response.ok) {
            console.log("Failed to send message to " + url);
            console.log(err)
          }
          else {
            console.log("Sent message succeeded to " + url);
          }
    });
  }
};

var getServiceToken = function(config, callback){
  console.log("Getting AuthToken for service");
  var body = {
  	"servicename": config.service.name,
  	"password": config.service.secret
  };

  request
     .post(config.auth.authServiceUrl)
     .send(body)
     .end(function(err, response){
        if (err || !response.ok) {
          console.log("Failed to get token from " + config.auth.authServiceUrl);
          console.log(err)
        }
        else {
          callback(response.text);
        }
  });
}

module.exports = init;
