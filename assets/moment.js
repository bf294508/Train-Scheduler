var firebaseConfig = {
    apiKey: "AIzaSyDj6u422KfHwKKsDCs9bWpiWcyKBO4hUhM",
    authDomain: "trainschedule-b9167.firebaseapp.com",
    databaseURL: "https://trainschedule-b9167.firebaseio.com",
    projectId: "trainschedule-b9167",
    storageBucket: "",
    messagingSenderId: "1073022613700",
    appId: "1:1073022613700:web:dfea98a4f14c8ab529b191"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Create a variable to reference the database
    var database = firebase.database();
  //Initial Vaiables
  var trainName ="";
  var trainDestination="";
  var trainFirstTime="";
  var trainFrequency =0;

  $("#submit").on("click",function(event){
      // Prevent the page from refreshing
      event.preventDefault();
      //get inputs
      trainName = $("#name-input").val().trim();
      trainDestination = $("#destination-input").val().trim();
      trainFirstTime = $("#firstTrainTime-input").val().trim();
      trainFrequency = $("#frequency-input").val().trim();
    
      //change what is saved in firebase
      database.ref().push({
          name: trainName,
          destination: trainDestination,
          firstTrain: trainFirstTime,
          frequency: trainFrequency,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
  });

  database.ref().on("child_added",function(childSnapshot){
      var nextArrival;
      var minAway;
      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTrainNew = moment(childSnapshot.val().firstTrain, "HH:mm").subtract(1, "years");
      var diffTime = moment().diff(moment(firstTrainNew), "minutes");
      var remainder = diffTime % childSnapshot.val().frequency;
      var minAway = childSnapshot.val().frequency - remainder;
      var nextTrain = moment().add(minAway, "minutes");
      nextTrain = moment(nextTrain).format("hh:mm");
      $("#add-row").append("<tr><td>" + childSnapshot.val().name +
      "</td><td>" + childSnapshot.val().destination +
      "</td><td>" + childSnapshot.val().frequency +
      "</td><td>" + nextTrain + 
      "</td><td>" + minAway + "</td></tr>");
  })


