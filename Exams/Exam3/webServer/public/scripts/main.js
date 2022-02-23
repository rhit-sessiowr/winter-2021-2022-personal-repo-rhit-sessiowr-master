/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Will Sessions
 */


/** namespace. */
var rhit = rhit || {};
const controllerUrl = "http://localhost:3000/api/";

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

		this.updateView();

	}

	move(fromIndex, toIndex) {
		if(fromIndex > 6 || toIndex > 6) {
			console.log("Error: not in range");
			return;
		}
		console.log(`I should be moving! fromIndex: ${fromIndex}, toIndex: ${toIndex}`);
		fetch(controllerUrl + `move/${fromIndex}/${toIndex}`, {method: "PUT"}).then(response => response.json)
		.then(data => {
			console.log("Days should be updated.");
		})
		this.updateView();
	}

	reset() {
		console.log("I should be resetting!");
		let data = {
			"days": ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] 
		}
		fetch(controllerUrl + "setdays", {
			method: "POST",
			headers: {
				"Content-Type": 'application/json'
			},
			body: JSON.stringify(data)
		}).then(response => response.json())
		.then(data => {
			console.log("View should be reset.");
		})
		this.updateView();
	}

	updateView() {
		console.log("Update the View!");
		fetch(controllerUrl + "getdays").then(response => response.json())
		.then(data => {
			console.log(data);
			for(let i = 0; i < data.length; i++) {
				document.querySelector(`#index${i}`).innerHTML = `${i}. ${data[i]}`;
			}
		});

	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	new rhit.ShuffleController();
};

rhit.main();
