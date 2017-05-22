var config = {
	apiKey: "AIzaSyAqi4CyjP649DPZbUisYpjhnjZGyHsf7tE",
	authDomain: "rps-multi-41263.firebaseapp.com",
	databaseURL: "https://rps-multi-41263.firebaseio.com",
	projectId: "rps-multi-41263",
	storageBucket: "rps-multi-41263.appspot.com",
	messagingSenderId: "314062800387"
};
//init firebase
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Link to Firebase Database for viewer tracking
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");


// Add ourselves to presence list when online.
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {
  	console.log("conn",snap.val())
    // Add user to the connections list.
    let con = connectionsRef.push(true);
    let id = con.key;
    $("#conns").append($("<p>").text(id).attr("id", "player"));

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});


// Number of online users is the number of objects in the presence list.
connectionsRef.on("value", function(snap) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  // $("#playerRow").text(snap.numChildren());
});

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

//phrases to display after results
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



$('#addPlayer').on('click', function(){
	event.preventDefault();
	let name = $('#playerNameInput').val();

	function choosePlayerNumber (callback) {
		database.ref().once("value").then(function(snap){
			if (!snap.val().player1){
				callback("player1")
			} else if (!snap.val().player2){
				callback("player2")
			} else {
				callback("max")
			}
		});
	}

	function setEnv (playerNumber) {
		console.log('callback', playerNumber);
		addPlayerToDB(playerNumber);
		setPlayerElems(playerNumber);
	}

	function addPlayerToDB (plyNum) {
		let player = database.ref("/curGame/"+plyNum).set({
			name: name,
			wins: 0,
			losses: 0
		})

		plyerDBUpdate = {};
		plyerDBUpdate['/'+plyNum] = true;
		playerID = database.ref().update(plyerDBUpdate);

		plyerDBUpdate['/'+plyNum] = false;
		database.ref().onDisconnect().update(plyerDBUpdate);

	}

	function setPlayerElems (playNum) {
		$('#subHead').empty();
		let newElem = $('<div>').addClass('center');
		newElem.append($('<h5>').text('Welcome, ' + name + '!'));
		
		//determine text for sub header
		let welcomeText;
		if (playNum === 'player1') {
			welcomeText = 'You are player 1.'
		} else if (playNum === 'player2') {
			welcomeText = 'You are player 2.'
		} else {
			welcomeText = "max players!"
		}

		newElem.append($('<p>').text(welcomeText));
		$('#subHead').append(newElem);
		$('#'+playNum+'h5').text(name);
		buildButtons(playNum,name);
	}

	choosePlayerNumber(setEnv);


})

function buildButtons (playerNum, displayName) {
	//set up some aliases
	let btnsToMake = ['Rock','Paper','Scissors','Lizard','Spock'];
	let btnClasses = 'waves-effect waves-light btn col s6 offset-s3';
	let mainDiv = $('#'+playerNum)
	//clear before adding anything
	mainDiv.empty();
	//make elements
	mainDiv.append($('<h5>').addClass('center').text(displayName));

	btnsToMake.forEach(function(value, index){
		//make a row and button, then append both to main
		let curRow = $('<div>').addClass('row');
		let curBtn = $('<button>').addClass(btnClasses).attr('type',value.toLowerCase()).text(value);
		mainDiv.append(curRow.append(curBtn));		
	})
}

