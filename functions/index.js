const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


//count unread message 
exports.unreadMessage = functions.https.onRequest((request, response) => {
  var db = admin.database();
  // var ref = db.ref("dinosaurs");
  // ref.orderByChild("dimensions/height").on("child_added",function(snapshot){
  //   console.log(snapshot.key + " ___was __" + snapshot.val().height);
  // })

  var ref = db.ref("dinosaurs");
  ref.orderByChild("dimensions/height").on("child_added", function(snapshot) {
    console.log(snapshot.key + " was " + JSON.stringify(snapshot.val()) + " meters tall");
  });
  //query order by value
  var scoresRef = db.ref("scores");
  scoresRef.orderByValue().on("value", function(snapshot) {
    snapshot.forEach(function(data) {
      console.log("The " + data.key + " dinosaur's score is " + data.val());
    });
  });
  //query limit
  var ref = db.ref("dinosaurs");
  ref.orderByChild("weight").limitToLast(2).on("child_added", function(snapshot) {
    console.log(snapshot.key);
  });
  //equal
  var ref = db.ref("dinosaurs");
  ref.orderByChild("height").equalTo(25).on("child_added", function(snapshot) {
    console.log(snapshot.key);
  });
  response.send("Just save successful !");
});
