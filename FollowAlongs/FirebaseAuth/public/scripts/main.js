var rhit = rhit || {};


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
		  // User is signed in, see docs for a list of available properties
		  // https://firebase.google.com/docs/reference/js/firebase.User
		  var uid = user.uid;
		  // ...
		  console.log("user is signed in: ", uid);
		} else {
			console.log("no user signed in");
		  // User is signed out
		  // ...
		}
	  });

	const inputEmailEl = document.querySelector("#inputEmail");
	const inputPasswordEl = document.querySelector("#inputPassword");

	document.querySelector("#signOutButton").onclick = (event) => {
		console.log("sign out");


		firebase.auth().signOut().then(() => {
			// Sign-out successful.
			console.log("You are now signed out");
		  }).catch((error) => {
			// An error happened.
			console.log("sign out error");
		  });

	};
	document.querySelector("#createAccountButton").onclick = (event) => {
		console.log(`create an account for email: ${inputEmailEl.value} and password: ${inputPasswordEl.value} `);




		firebase.auth().createUserWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value)
			.then((userCredential) => {
				// Signed in 
				var user = userCredential.user;
				// ...
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("create account error: ", errorCode, errorMessage);
				// ..
			});

	};
	document.querySelector("#logInButton").onclick = (event) => {
		console.log(`log in with email: ${inputEmailEl.value} and password: ${inputPasswordEl.value} `);



		firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value)
			.then((userCredential) => {
				// Signed in
				var user = userCredential.user;
				// ...
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("existing account login error: ", errorCode, errorMessage);

			});

	};



};

rhit.main();