var config = {
	apiKey: "AIzaSyAqi4CyjP649DPZbUisYpjhnjZGyHsf7tE",
	authDomain: "rps-multi-41263.firebaseapp.com",
	databaseURL: "https://rps-multi-41263.firebaseio.com",
	projectId: "rps-multi-41263",
	storageBucket: "rps-multi-41263.appspot.com",
	messagingSenderId: "314062800387"
};
firebase.initializeApp(config);



// Create a variable to reference the database.
var database = firebase.database();

// Link to Firebase Database for viewer tracking
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

// func to compare and get result, print to console
var checkForResult = function (chPly, chCmp) {
  var player = choices.indexOf(chPly);
  var comp = choices.indexOf(chCmp);
  let n = choices.length;
  let res = (n + player - comp) % n;
  
  if (res === 0) {
  	console.log("Tie!");
  } else if (res % 2 === 1) {
  	console.log("You win!")
  	console.log(winList[chPly][chCmp])
  } else if (res % 2 === 0) {
  	console.log("You Lose!")
	console.log(winList[chCmp][chPly])
  }
}

winList = {
	rock : {
		scissors : "Rock crushes Scissors.",
		lizard : "Rock crushes Lizard."
	},
	paper : {
		rock : "Paper covers Rock.",
		spock : "Paper disproves Spock."
	},
	scissors : {
		paper : "Scissors cuts Paper.",
		lizard : "Scissors decapitate Lizard."
	},
	lizard : {
		spock : "Lizard poisons Spock.",
		paper : "Lizard eats Paper."
	},
	spock : {
		scissors : "Spock smashes Scissors.",
		rock : "Spock vaporizes Rock."
	}
}