var CoreObject   = require('core-object');
var Promise      = require('ember-cli/lib/ext/promise');
var SilentError  = require('silent-error');
var chalk        = require('chalk');
var fs           = require('fs');
var walk         = require('walk');
var mime         = require('mime-types');

var white = chalk.white;
var green = chalk.green;

var EXPIRE_IN_2030 = new Date('2030');
var TWO_YEAR_CACHE_PERIOD_IN_SEC = 60 * 60 * 24 * 365 * 2;
var TMP_DIR = 'tmp/assets-sync';

module.exports = CoreObject.extend({
  init: function() {
    if (!this.config) {
      return Promise.reject(new SilentError('You have to pass a config!'));
    }

    this.ALY    = this.ALY || require('aliyun-sdk')

    var ossServer = this.config.assets.ossServer ? this.config.assets.ossServer : 'http://oss-cn-hangzhou.aliyuncs.com';

    this.client = new this.ALY.OSS({
      accessKeyId: this.config.assets.accessKeyId,
      secretAccessKey: this.config.assets.secretAccessKey,
      endpoint: ossServer,
      apiVersion: '2013-10-15'
    });
  },

  uploadToAlioss: function(bucketName, filepath, filename, callback) {
    var _this = this;
    fs.readFile(filepath, function (error, data) {
      if (error) {
        Promise.reject(new SilentError('Read file error: ' + error));
        return;
      }

      var contentEncoding = _this.isGzippedContent(filename) ? 'gzip' : 'utf-8';
      var contentType     = mime.lookup(filename);

      _this.client.putObject({
        Bucket: bucketName,
        Key: filename,
        Body: data,
        CacheControl: 'max-age='+TWO_YEAR_CACHE_PERIOD_IN_SEC+', public',
        Expires: EXPIRE_IN_2030,
        ContentDisposition: '',
        ContentEncoding: contentEncoding,
        ContentType: contentType
      },
      function (err, data) {
        if (err) {
          callback(err);
          return;
        }
        callback(null, data); //Saved success
      });
    });
  },

  upload: function() {
    var client = this.client;
    var _this  = this;
    var dir    = TMP_DIR;

    if (!this.ui) {
      var message = 'You have to pass a UI to an adapter.';
      return Promise.reject(new SilentError(message));
    }

    this.ui.pleasantProgress.start(green('Uploading assets'), green('.'));

    return new Promise(function(resolve, reject) {

      var walker  = walk.walk(dir, { followLinks: false });

      walker.on('file', _this.fileUpload.bind(_this));

      walker.on('errors', _this.logUploadError.bind(_this, reject));

      walker.on('end', _this.logUploadSuccess.bind(_this, resolve));

    });
  },

  fileUpload: function(root, stat, next) {
    var bucketName = this.config.assets.bucket;
    var filepath   = root + '/' + stat.name;
    var uploadpath = filepath.replace(TMP_DIR, '').replace(/^(\.\/|\/)/, '');

    this.ui.writeLine('Uploading: ' + green(uploadpath));
    this.uploadToAlioss(bucketName, filepath, uploadpath, next);
  },

  logUploadError: function(reject, error) {
    var errorMessage = 'Unable to sync: ' + error.stack;
    reject(new SilentError(errorMessage));
  },

  logUploadSuccess: function(resolve) {
    this.printEndMessage();
    resolve();
  },

  printEndMessage: function() {
    this.ui.writeLine('Assets upload successful. Done uploading.');
    this.ui.pleasantProgress.stop();
  },

  isGzippedContent: function(filename) {
    var gzipExtensions = this.config.assets.gzipExtensions ? this.config.assets.gzipExtensions : ['js', 'css', 'svg'];
    var ext = filename.replace(/.*[\.\/\\]/, '').toLowerCase();
    return gzipExtensions.indexOf(ext) != -1;
  }
});
