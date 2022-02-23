/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Will Sessions
 */

/** namespace. */
var rhit = rhit || {};
const URL = "http://localhost:3000/api/";

rhit.ShuffleController = class {
	constructor() {
		document.querySelector("#moveButton").onclick = (event) => {
			let fromIndex = document.querySelector("#fromIndex").value;
			let toIndex = document.querySelector("#toIndex").value;
			console.log(`Move the weekdays! From index: ${fromIndex} to: ${toIndex}`);
			this.move(fromIndex, toIndex);
		}
		document.querySelector("#resetButton").onclick = (event) => {
			console.log("reset the days. use the setdays api.");
			this.reset();
		}

	}

	move(fromIndex, toIndex) {
		console.log(`I should be moving! fromIndex: ${fromIndex}, toIndex: ${toIndex}`);
		this.updateView();
	}

	reset() {
		console.log("I should be resetting!");
		this.updateView();
	}

	updateView() {
		console.log("Update the View!");

	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	new rhit.ShuffleController();
};

rhit.main();
