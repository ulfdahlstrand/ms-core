var request = require("superagent");

var config;
var init = function(input_config){
  config = input_config;
};

var register = function(message, scope, host, path){
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

var sendMessage = function(message, scope, data){
  var communicator = config.communicator;
  if(communicator && communicator.service && communicator.service.name && communicator.path && communicator.token){
    var body = {
      "name": communicator.service.name,
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

module.exports = function(){
  return {
    init: init,
    register: register,
    sendMessage: sendMessage
  };
}
