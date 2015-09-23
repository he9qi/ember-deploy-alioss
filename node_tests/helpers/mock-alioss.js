var CoreObject = require('core-object');

var MockClient = function(options) {
  options = options || {};
};

MockClient.prototype.uploadToAlioss = function(bucketName, filepath, uploadpath, next) {

};

module.exports = CoreObject.extend({
  init: function(options) {
    var client = new MockClient(options);
    return client;
  }
});
