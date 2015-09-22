/* jshint node: true */
'use strict';

var AliOSSAdapter = require('./lib/alioss');

module.exports = {
  name: 'ember-deploy-alioss',

  type: 'ember-deploy-addon',

  adapters: {
    assets: {
      'alioss': AliOSSAdapter
    }
  }
};
