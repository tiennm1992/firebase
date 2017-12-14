const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.createUser = functions.https.onRequest((request, response) => {
  // const email = request.body.email;
  // const password = request.body.password;
  // const id = request.body.id; 
  const email = request.query.email;
  const password = request.query.password;
  const id = request.query.id;
  //check empty email and password
  //create user
  admin.auth().createUser({
    uid:id,
    email:email,
    emailVerified: false,
    password: password,
    displayName: "John Doe",
    // photoURL: "http://www.example.com/12345678/photo.png",
    disabled: false
  })
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log("Successfully created new user:", userRecord.uid);
    response.send('{"code":"true","message":"Successfully created a new user !","uid":'+userRecord.uid+'}');
  })
  .catch(function(error) {
    console.log("Error creating new user:", error);
    response.send(JSON.stringify(error) );
  });
});
//
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

//update information for user
exports.updateInforUser = functions.https.onRequest((request, response) => {
  const avatar = request.body.avatar;
  const name = request.body.name;
  const push_token = request.body.push_token; 
  const status = request.body.status; 
  const uid = request.body.uid; 
  // Grab the text parameter.
  var update_infor= {
    avatar :avatar,
    name:name,
    push_token:push_token,
    status:status,
    uid:uid
  }
  admin.database().ref("/Conversations/"+uid).update({infor: update_infor}).then(snapshot => {
    response.send("Just save successful !");
  });
});

//update datetime
// exports.updateClientTime = functions.database.ref('/messages/{pushId}/name')
// .onWrite(event => {
//   var now = new Date().getTime();
//   return event.data.ref.parent.child('client_time').set(now);
// });

//update and create conversation
exports.updateConversation = functions.database.ref('/Messages/{conversationId}/{pushId}')
.onWrite(event => {
  const message_data = event.data.val();
//parse data
const travel_id = message_data.travel_id;
const trip_id = message_data.trip_id;
const from_id = message_data.from_id;
const to_id = message_data.to_id;
const user_type_from = message_data.user_type_from;
const user_type_to = message_data.user_type_to;
const last_message = message_data.message;
const sent_time = message_data.sent_time;
const conversation_id = event.params.pushId;

console.log('This is data: '+ JSON.stringify(message_data));
var db = admin.database();
var trip_travel=trip_id + '_' + travel_id;
  
if ( from_id ==0 || to_id==0 ){
  if (from_id ==0) {
   var user_admin = from_id +'_'+ to_id;
 }else{
  var user_admin = to_id +'_'+ from_id;
}
var adminRef = db.ref("/Conversations/"+to_id+'/admin/'+user_admin);
adminRef.child("last_message").set(last_message);
adminRef.child("partner_id").set(from_id);
adminRef.child("sent_time").set(sent_time);
adminRef.child("conversation_id").set(conversation_id);
    // partner update conversation
    var clientRef = db.ref("/Conversations/"+from_id+'/admin/'+user_admin);
    clientRef.child("last_message").set(last_message);
    clientRef.child("partner_id").set(to_id);
    clientRef.child("sent_time").set(sent_time);
    clientRef.child("conversation_id").set(conversation_id);
  }else {
    //update user to
    if (user_type_to == 1) {
      var toRef = db.ref("/Conversations/"+to_id+'/passenger/'+trip_travel);
    }else{
      var toRef = db.ref("/Conversations/"+to_id+'/driver/'+trip_travel);
    }
    toRef.child("last_message").set(last_message);
    toRef.child("partner_id").set(from_id);
    toRef.child("sent_time").set(sent_time);
    toRef.child("conversation_id").set(conversation_id);

    //update user from
    if (user_type_from == 1) {
      var fromRef = db.ref("/Conversations/"+from_id+'/passenger/'+trip_travel);
    }else{
      var fromRef = db.ref("/Conversations/"+from_id+'/driver/'+trip_travel);
    }
    fromRef.child("last_message").set(last_message);
    fromRef.child("partner_id").set(to_id);
    fromRef.child("sent_time").set(sent_time);
    fromRef.child("conversation_id").set(conversation_id);
  }
  return true;
 // return event.data.ref.parent.child('client_time').update(now);
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



