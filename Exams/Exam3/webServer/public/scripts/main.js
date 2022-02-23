/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * PUT_YOUR_NAME_HERE
 */

/** namespace. */
var rhit = rhit || {};

rhit.ShuffleController = class {
	constructor() {
		document.querySelector("#moveButton").onclick = (event) => {
			let fromIndex = document.querySelector("#fromIndex").value;
			let toIndex = document.querySelector("#toIndex").value;
			console.log(`Move the weekdays! From index: ${fromIndex} to: ${toIndex}`);
		}
		document.querySelector("#resetButton").onclick = (event) => {
			console.log("reset the days. use the setdays api.");
		}
	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	new rhit.ShuffleController();
};

rhit.main();
