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
  var original = JSON.stringify(req.body.message_data);
  //res.send(JSON.stringify(req.body.message_data));
  var left_cut1 = original.substring(original.indexOf("addresses") + 25);
  var left_cut2 = left_cut1.substring(left_cut1.indexOf("name") + 7);
  var name = left_cut2.substring(0, left_cut2.indexOf("}") - 1);
  

  var left_subj = original.substring(original.indexOf("\"subject\"") + 11);
  var subject = left_subj.substring(0, left_subj.indexOf(",\"folders\"") - 1);
  
  Parse.Push.send({
    channels: [ "account_id_" + req.body.account_id ],
    data: {
      alert: name + "\n" + subject,
      sound: "notifsound.m4a"
    }
  }, {
    success: function() {
      res.send("success");
      // Push was successful
    },
    error: function(error) {
      // Handle error
    }
  }); 
  console.log("here2");
  //iconsole.log(req.body.webhook_id);
  
  //console.log("webhook_id_" + req.body.webhook_id);*/
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
