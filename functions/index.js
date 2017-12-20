const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


//count unread message 
exports.unreadMessage = functions.https.onRequest((request, response) => {
  var height = request.query.height;
  var weight = request.query.weight;    

  var db = admin.database();
  var ref = db.ref("dinosaurs");
  ref.orderByChild("dimensions/height").on("child_added", function(snapshot) {
    console.log(snapshot.key + " was " + snapshot.val().dimensions.height);
  });

  ref.orderByChild("height").equalTo(height).on("child_added",function(snapshot){
    console.log(snapshot.key+ " and this is equal function: " + JSON.stringify(snapshot.val()));
  });

  // //query order by value
  // var scoresRef = db.ref("scores");
  // scoresRef.orderByValue().on("value", function(snapshot) {
  //   snapshot.forEach(function(data) {
  //     console.log("The " + data.key + " dinosaur's score is " + data.val());
  //   });
  // });
  // //query limit
  // var ref = db.ref("dinosaurs");
  // ref.orderByChild("weight").limitToLast(2).on("child_added", function(snapshot) {
  //   console.log(snapshot.key);
  // });
  // //equal
  // var ref = db.ref("dinosaurs");
  // ref.orderByChild("height").equalTo(25).on("child_added", function(snapshot) {
  //   console.log(snapshot.key);
  // });
  response.send("Just save successful !");
});
