var fs = require('fs');
var parse = require('co-body');
var logger = require('koa-logger');
var auth = require('koa-basic-auth');
var serve = require('koa-static');
var route = require('koa-router');
var request = require('co-request');
var koa = require('koa');
var app = koa();

// Init logger
app.use(logger());

// BASIC auth
// app.use(function *(next) {
//   try {
//     yield next;
//   } catch (err) {
//     if (401 == err.status) {
//       this.status = 401;
//       this.set('WWW-Authenticate', 'Basic');
//       this.body = '<h1>:(</h1>';
//     } else {
//       throw err;
//     }
//   }
// });
// app.use(auth({ name: 'test', pass: 'test' }));

// Init router
app.use(route(app));
// Init public dir for css, js and etc..
app.use(serve(__dirname + '/public'));

/**
 * Index page
 */
app.get('/', function *(next) {
  var indexHTML = fs.readFileSync(__dirname + '/public/index.html', 'utf-8');

  this.body = indexHTML;
});

/**
 * Simple test for GET request
 */
app.get('/get-test', function *(next) {
  var data = {
    'title': 'Koa test application',
    'body': 'Hello World!'
  };

  this.body = data;
});

/**
 * Simple test for POST request
 */
app.post('/post-test', function *(next) {
  // parse POST request
  var body = yield parse.json(this);

  var data = {
    'title': body.title,
    'body' : body.body
  };

  this.body = data;
});


var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening to %s', port);