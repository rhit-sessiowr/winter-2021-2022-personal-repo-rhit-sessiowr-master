/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Will Sessions
 */

/** namespace. */
var rhit = rhit || {};

/** globals */
rhit.counter = 0;

/** function and class syntax examples */
// rhit.functionName = function () {
// 	/** function body */
// };

// rhit.ClassName = class {
// 	constructor() {

// 	}

// 	methodName() {

// 	}
// }

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
    document.querySelector("#decButton").onclick = (event) => {
         rhit.counter -= 1;
         rhit.updateView(rhit.counter);
    }
    document.querySelector("#incButton").onclick = (event) => {
        rhit.counter += 1;
        rhit.updateView(rhit.counter);
    }
    document.querySelector("#resetButton").onclick = (event) => {
        rhit.counter = 0;
        rhit.updateView(rhit.counter);
    }

	document.querySelector("#redButton").onclick = (event) => {
		document.querySelector("#favoriteColorBox").style["background-color"] = "red";
		document.querySelector("#favoriteColorBox").innerHTML = "Red";
	}

	document.querySelector("#blueButton").onclick = (event) => {
		document.querySelector("#favoriteColorBox").style["background-color"] = "blue";
		document.querySelector("#favoriteColorBox").innerHTML = "Blue";
	}

	document.querySelector("#greenButton").onclick = (event) => {
		document.querySelector("#favoriteColorBox").style["background-color"] = "green";
		document.querySelector("#favoriteColorBox").innerHTML = "Green";
	}

	document.querySelector("#purpButton").onclick = (event) => {
		document.querySelector("#favoriteColorBox").style["background-color"] = "purple";
		document.querySelector("#favoriteColorBox").innerHTML = "Purple";
	}
};

rhit.updateView = function(num) {
    // document.querySelector("#counterText").innerHTML = "Count = " + counter;
    document.querySelector("#count").innerHTML = `${num}`;
}
rhit.main();
