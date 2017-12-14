exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  const name = req.query.name;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  admin.database().ref('/messages').push({original: original,name: name}).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.send("Just save successful !");
    // res.redirect(303, snapshot.ref);
  });
});


// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onWrite(event => {
      // Grab the current value of what was written to the Realtime Database.
      console.log(event.data.val());
      const original = event.data.val();
      console.log('Uppercasing', event.params.pushId, original);
      const uppercase = original.toUpperCase();

      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return event.data.ref.parent.child('uppercase').set(uppercase);
    });

//merge message
exports.mergeMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  const name = req.query.name;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  admin.database().ref('/messages').push({original: original,name: name}).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.send("Just save successful !");
    // res.redirect(303, snapshot.ref);
  });
});




//push for message chat
exports.pushNotification = functions.database.ref('/messages/{pushId}/original').onWrite( event => {
	console.log(res)
    // Grab the text parameter.
    const fromID  = req.query.from_id;
    const toID    = req.query.to_id;
    const msg     = req.query.message;
    const type    = req.query.type;

    console.log('from_id' , from_id);
   //Push the new message into the Realtime Database using the Firebase Admin SDK.
   var registrationToken = "ca1bw1jsUhA:APA91bHP2-FWFX3f-ZNvq-VKhsB1hzHY5wWzUdlCvUv_vPyhBEjvTaLliDVVhOu87PijVTiibawwdXCkX3AJViuAjXTeTnsYo4z0X0iQTEGMSwwk2wPT4DZNf7gbFBi0Y8zoVBEZhYHO";
   if( fromID == 400)
   {
   	registrationToken = "ZDVJcRSFOs:APA91bExiE1o_A8u9GSdytP0Fti5ufLAcVz9IBlejZn1_v6zc3c_2GiFmQ4jZ4tdNLe5vLiMvKQ47Tg4Iw_1iLuWvFSyMEDrIBrS04bIbLJiRSx5VZjQ2u03R31lcZentENQK9jNJfTd";
   }
     // See the “Defining the message payload” section below for details
      // on how to define a message payload.
      var payload = {
      	notification: {
      		title: toID,
      		body: msg
      	}
      };
     // Send a message to the device corresponding to the provided
      // registration token.
      admin.messaging().sendToDevice(registrationToken, payload)
      .then(function(response) {
          // See the MessagingDevicesResponse reference documentation for
          // the contents of response.
          console.log("Successfully sent message:", registrationToken);
        })
      .catch(function(error) {
      	console.log('Error sending message:', error);
      });
    });

//check unread message and save total unread
exports.pushNotification = functions.database.ref('/messages/{pushId}/original').onWrite( event => {
	
});


//push for message chat
exports.pushNotification = functions.database.ref('/messages/{pushId}').onWrite( event => {
// Get a database reference to our posts
var db = admin.database();
const message_data = event.data.val();
var scoresRef = db.ref("/fcmTokens");
scoresRef.orderByValue().on("value", function(snapshot) {
  snapshot.forEach(function(data) {
    console.log("The " + data.key + " dinosaur's score is " + data.val());
    var registrationToken =  data.key ;
    var payload = {
      notification:  {
       "title": message_data.name,
       "body": message_data.text,
       "icon": "/images/profile_placeholder.png",
       "click_action": "http://localhost:5000"
     },
   };
   admin.messaging().sendToDevice(registrationToken, payload)
   .then(function(response) {
    console.log("Successfully sent message:", registrationToken);
  })
   .catch(function(error) {
    console.log('Error sending message:', error);
  });
 });
});
});


//
exports.updateClientTime = functions.database.ref('/messages/{pushId}/name')
.onWrite(event => {
  // call push
  var db = admin.database();
  const message_data = event.data.val();
  var scoresRef = db.ref("/fcmTokens");
  scoresRef.orderByValue().on("value", function(snapshot) {
    snapshot.forEach(function(data) {
      console.log("The " + data.key + " dinosaur's score is " + data.val());
      var registrationToken =  data.key ;
      var request = require('request');
      request('http://52.197.181.196/sql/firebase?m='+ message_data.text+'&id='+registrationToken, function (error, response, body) {
        if (!error && response.statusCode == 200) {
        console.log(body) // Print the google web page.
      }
    });
    });
  });
  //
  var now = new Date().getTime();
  return event.data.ref.parent.child('client_time').set(now);
});


// test
exports.createUser1 = functions.https.onRequest((request, response) => {
  // const email = request.body.email;
  // const password = request.body.password;
  // const id = request.body.id; 
  // const email = request.query.email;
  // const password = request.query.password;
  // const id = request.query.id;
  //check empty email and password
  response.send(request.body);
});