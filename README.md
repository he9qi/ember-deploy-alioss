# Ember Deploy Alioss
[![Build Status](https://travis-ci.org/he9qi/ember-deploy-alioss.svg?branch=master)](https://travis-ci.org/he9qi/ember-deploy-alioss)

This is the alioss-adapter implementation to use [阿里云对象存储 aliyun oss](http://oss.aliyun.com/) with
[ember-deploy](https://github.com/levelbossmike/ember-deploy).

## Installation
You also need dependencies `ember-deploy` and an index adapter such as `ember-deploy-redis` or `ember-deploy-s3-index`, etc.
```sh
ember install ember-deploy-alisso
```

## Aliyun OSS Policy Requirements
Make sure to enable your bucket's ACL to public read.
![Alisso ACL](https://cloud.githubusercontent.com/assets/5576425/10038074/0b65078a-6174-11e5-90c6-dbe878c45a9d.jpg)


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
