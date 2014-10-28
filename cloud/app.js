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

app.post('/test', function(req, res) { 
  var webhookClass = Parse.Object.extend("webhookClass");
  var query = new Parse.Query(webhookClass);
  query.equalTo("account_id", req.body.account_id);
  query.find({
  success: function(results) {
    var webhookObject = results[0];
    var senders = webhookObject.get('webhookSender');
    console.log(senders[0]);
      res.send("success");

    // The object was retrieved successfully.
  },
  error: function(object, error) {
      res.send("failure");

    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and message.
  }
  });
});

app.post('/send_notification', function(req, res) { 
  var original = JSON.stringify(req.body.message_data);
  //res.send(JSON.stringify(req.body.message_data));
  var left_cut1 = original.substring(original.indexOf("addresses") + 10);
  var gmail_message_id = parseInt(req.body.message_data.gmail_message_id,16);
  var gmail_thread_id = parseInt(req.body.message_data.gmail_thread_id,16);
  var subject = req.body.message_data.subject;
  var email_message_id = req.body.message_data.email_message_id;
  //console.log("\nemail_message_id:" + email_message_id);
  var name = "";
  // if name for sender exists, then display name
  if (left_cut1.indexOf("\"name\"") < left_cut1.indexOf("\"to\"")) {
    var left_cut2 = left_cut1.substring(left_cut1.indexOf("\"name\"") + 8);
    var name = left_cut2.substring(0, left_cut2.indexOf("}") - 1);
  }
  // else display email address to be seen on first line of notif
  else {
    var left_cut2 = left_cut1.substring(left_cut1.indexOf("\"email\"") + 9);
    var name = left_cut2.substring(0, left_cut2.indexOf("}") - 1);
  }
  // prepare subject to be displayed on second line
  var left_subj = original.substring(original.indexOf("\"subject\"") + 11);
  var subject = left_subj.substring(0, left_subj.indexOf(",\"folders\"") - 1);
   
  Parse.Push.send({
    channels: [ "account_id_" + req.body.account_id ],
    data: {
      alert: name + "\n" + subject,
      sound: "notifsound.m4a",
      messageID: gmail_message_id,
      threadID: gmail_thread_id,
      subject: subject,
      emailMessageID: email_message_id
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
  console.log(req.body);
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