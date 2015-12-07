# Ember Deploy Alioss
[![Build Status](https://travis-ci.org/he9qi/ember-deploy-alioss.svg?branch=master)](https://travis-ci.org/he9qi/ember-deploy-alioss)
[![Code Climate](https://codeclimate.com/github/he9qi/ember-deploy-alioss/badges/gpa.svg)](https://codeclimate.com/github/he9qi/ember-deploy-alioss)
[![Ember Observer](http://emberobserver.com/badges/ember-deploy-alioss.svg)](http://emberobserver.com/addons/ember-deploy-alioss)
[![](https://ember-cli-deploy.github.io/ember-cli-deploy-version-badges/plugins/ember-deploy-alioss.svg)](http://ember-cli-deploy.github.io/ember-cli-deploy-version-badges/)

This is the alioss-adapter implementation to use [阿里云对象存储 aliyun oss](http://oss.aliyun.com/) with
[ember-deploy](https://github.com/levelbossmike/ember-deploy) 

## Version

This plugin is for Ember Cli Deploy version v0.4.x. If you need version v0.5.x. Please checkout [https://github.com/he9qi/ember-cli-deploy-alioss](https://github.com/he9qi/ember-cli-deploy-alioss).

## Installation
You also need dependencies `ember-deploy` and an index adapter such as `ember-deploy-redis` or `ember-deploy-s3-index`, etc.
```sh
ember install ember-deploy-alioss
```

## Aliyun OSS Policy Requirements
Make sure to enable your bucket's ACL to public read.
<br>
<img src="https://cloud.githubusercontent.com/assets/5576425/10038074/0b65078a-6174-11e5-90c6-dbe878c45a9d.jpg" width="640">


## Setup
In `deploy.js`, set environment as
```javascript
// ...
assets: {
  type: 'alioss',
  bucket: '<your-bucket-name>',
  accessKeyId: process.env.ALIOSS_KEY,
  secretAccessKey: process.env.ALIOSS_SECRET,
}
```

Add fingerprint prepend in `ember-cli-build.js`
```javascript
// ...
module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    fingerprint: {
      prepend: '//<your-bucket-name>.oss-cn-hangzhou.aliyuncs.com/'
    }
  });
  return app.toTree();
};
```

## Contributing
PRs welcome!
