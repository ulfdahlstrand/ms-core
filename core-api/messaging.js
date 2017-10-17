var request = require("superagent");

var init = function(input_config){
  var config = input_config;
  return  {
    config: input_config,
    register: function(message, scope, host, path) {
      register(message, scope, host, path, config);
    },
    sendMessage: function(message, scope, data) {
      sendMessage(message, scope, data, config);
    },
  }
};

var register = function(message, scope, host, path, config){
  var communicator = config.communicator;
  var service = config.service;
  if(communicator && communicator.path && communicator.token && service && service.name){
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
       .set('Authorization', config.communicator.token)
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

var sendMessage = function(message, scope, data, config){
  var communicator = config.communicator;
  var service = config.service;
  if(communicator && communicator.path && communicator.token && service && service.name){
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
       .set('Authorization', config.communicator.token)
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

module.exports = init;
