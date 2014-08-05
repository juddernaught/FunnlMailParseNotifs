
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

var qs = require('querystring');

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

app.post('/send_notification', function(req, res) { 
  Parse.Push.send({
    channels: [ "testers" ],
    data: {
      alert: "Testing Notification: Dan Judd just got an important email."
    }
  }, {
    success: function() {
      // Push was successful
    },
    error: function(error) {
      // Handle error
    }
  }); 
  console.log(req);
  console.log(req.body);
  console.log(req.body.webhook_id);
  console.log(JSON.parse(req));
});

app.post('/failure', function(req, res) {
  console.log('failure');
});

// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
app.listen();
