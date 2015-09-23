"use strict";

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var MockAliOSS = require('../../helpers/mock-alioss');
var MockUI = require('ember-cli/tests/helpers/mock-ui');
var AliOSSAdapter = require('../../../lib/alioss');
var chalk = require('chalk');

chai.use(chaiAsPromised);

var aliOSSAdapter;
var expect = chai.expect;

var getLastUILine = function(output) {
  var uiOutputByLine = output.split("\n");
  return uiOutputByLine[uiOutputByLine.length - 2];
};

var stubConfig = {
  "assets": {
    "accessKeyId": "<your-access-key-goes-here>",
    "secretAccessKey": "<your-secret-access-key-goes-here>",
    "bucket": "<your-bucket-name>"
  }
};

var stubConfigTmpDir = {
  "assets": {
    "accessKeyId": "<your-access-key-goes-here>",
    "secretAccessKey": "<your-secret-access-key-goes-here>",
    "bucket": "<your-bucket-name>",
    "tmpDir": "/"
  }
};

describe('AliOSSAdapter', function() {
  beforeEach(function() {
    aliOSSAdapter = new AliOSSAdapter({
      ui: new MockUI(),
      ALY: {OSS: MockAliOSS},
      config: stubConfig
    });
  });

  it('rejects if no ui is passed on initialization', function() {
    aliOSSAdapter = new AliOSSAdapter({
      ALY: {OSS: MockAliOSS},
      config: stubConfig
    });
    expect(aliOSSAdapter.upload()).to.be.rejected;
  });

  describe('#upload', function() {

    it('rejects when the upload encounters an error', function() {
      var promise = aliOSSAdapter.upload();

      expect(promise).to.be.rejected;
    });

    it('resolves when the upload success', function() {
      var promise = aliOSSAdapter.upload();

      aliOSSAdapter = new AliOSSAdapter({
        ui: new MockUI(),
        ALY: {OSS: MockAliOSS},
        config: stubConfigTmpDir
      });

      expect(promise).to.be.resolved;
    });

    it('prints the filename for every fileUpload', function() {
      var root = 'tmp/assets-sync';
      var stat = { name: 'filename-f1n63rpr1n7.js' };
      var next = null;

      var expected = 'Uploading: filename-f1n63rpr1n7.js';

      aliOSSAdapter.fileUpload(root, stat, next);

      var lastLine = getLastUILine(aliOSSAdapter.ui.output);
      expect(chalk.stripColor(lastLine)).to.eq(expected);
    });

  });
});
