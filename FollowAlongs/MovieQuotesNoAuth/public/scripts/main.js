/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * PUT_YOUR_NAME_HERE
 */

/** namespace. */
var rhit = rhit || {};

/** globals */
rhit.variableName = "";

/** function and class syntax examples */
rhit.functionName = function () {
	/** function body */
};

rhit.ClassName = class {
	constructor() {

	}

	methodName() {

	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	
	//Temp code for read and add
	const ref = firebase.firestore().collection("MovieQuotes");
	ref.onSnapshot((querySnapshot) => {
		console.log("snapshot gotten");
		querySnapshot.forEach((doc) => {
			console.log(doc.data());
		});
	});



};

rhit.main();
