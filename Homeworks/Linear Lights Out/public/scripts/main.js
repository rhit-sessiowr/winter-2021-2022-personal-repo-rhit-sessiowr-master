/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Will Sessions
 */

/** namespace. */
var rhit = rhit || {};


rhit.PageController = class {
	constructor() {
		this.game = new rhit.LightsOutGame();
		rhit.numPresses = 0;
		const rects = document.querySelectorAll(".rect");
		for(const rect of rects) {
			rect.onclick = (event) => {
				const buttonIndex = parseInt(rect.dataset.index);
				this.game.pressedButtonAtIndex(buttonIndex);
				this.updateView();
				
			}
		}
		document.querySelector("#newGameButton").onclick  = (event) => {
			this.game = new rhit.LightsOutGame();
			this.updateView();
		}

		this.updateView();

	}


	updateView() {
		// ON = goldenrod color, black text. OFF = #333333, white text. 
		const rects = document.querySelectorAll(".rect");
		rects.forEach((rect, index) => {
			rect.innerHTML = this.game.getNumAtIndex(index);
			if(this.game.getNumAtIndex(index) == rhit.LightsOutGame.LIGHT_STATE.ON) {
				rect.style["background-color"] = "goldenrod";
				rect.style["color"] = "black";
			}	
			if(this.game.getNumAtIndex(index) == rhit.LightsOutGame.LIGHT_STATE.OFF) {
				rect.style["background-color"] = "#333333";
				rect.style["color"] = "white";
			}	
		});

		if(this.game.getState() == rhit.LightsOutGame.GAME_STATE.PRESSED_ONE) {
		document.querySelector("#gameStateText").innerHTML = "You have taken 1 move so far.";
		} else if (this.game.getState() == rhit.LightsOutGame.GAME_STATE.PRESSED) {
			document.querySelector("#gameStateText").innerHTML = "You have taken " + this.game.getNumPressed() + " moves so far.";
		} else if(this.game.getState() == rhit.LightsOutGame.GAME_STATE.WIN) {
			document.querySelector("#gameStateText").innerHTML = "You won in " + this.game.getNumPressed() + " moves!"; 
		}
		else {
			document.querySelector("#gameStateText").innerHTML = "Make the buttons match";
		}
	}
}

rhit.LightsOutGame = class {
	static NUM_BUTTONS = 7;
	static LIGHT_STATE = {
		ON: "1",
		OFF: "0"
	}

	static GAME_STATE = {
		START: "Make the buttons match",
		PRESSED_ONE: "First Button Pressed.",
		PRESSED: "Button Pressed.",
		WIN: "You win!"
	}


	constructor() {
		this.buttonValues = [];
		this.numPresses = 0;
		for(let i = 0; i < rhit.LightsOutGame.NUM_BUTTONS; i++) {
			let rand = parseInt(Math.random() * 100);
			if(rand % 2 == 0) {
				this.buttonValues.push(rhit.LightsOutGame.LIGHT_STATE.ON);
			} else {
				this.buttonValues.push(rhit.LightsOutGame.LIGHT_STATE.OFF);

			}

		}
	}

	pressedButtonAtIndex(index) {
		if(this.state == rhit.LightsOutGame.GAME_STATE.WIN) {
			return;
		}
		if(index == 0) {
			if(this.buttonValues[index] == rhit.LightsOutGame.LIGHT_STATE.ON) {
				this.buttonValues[index] = rhit.LightsOutGame.LIGHT_STATE.OFF;
			}
			else if(this.buttonValues[index] == rhit.LightsOutGame.LIGHT_STATE.OFF) {
				this.buttonValues[index] = rhit.LightsOutGame.LIGHT_STATE.ON;
			}
			if(this.buttonValues[index + 1] == rhit.LightsOutGame.LIGHT_STATE.ON) {
				this.buttonValues[index + 1] = rhit.LightsOutGame.LIGHT_STATE.OFF;
			} else if(this.buttonValues[index + 1] = rhit.LightsOutGame.LIGHT_STATE.OFF) {
				this.buttonValues[index + 1] = rhit.LightsOutGame.LIGHT_STATE.ON;
			}
		}
		if(index == 6) {
			if(this.buttonValues[index] == rhit.LightsOutGame.LIGHT_STATE.ON) {
				this.buttonValues[index] = rhit.LightsOutGame.LIGHT_STATE.OFF;
			}
			else if(this.buttonValues[index] == rhit.LightsOutGame.LIGHT_STATE.OFF) {
				this.buttonValues[index] = rhit.LightsOutGame.LIGHT_STATE.ON;
			}
			if(this.buttonValues[index - 1] == rhit.LightsOutGame.LIGHT_STATE.ON) {
				this.buttonValues[index - 1] = rhit.LightsOutGame.LIGHT_STATE.OFF;
			} else if(this.buttonValues[index - 1] = rhit.LightsOutGame.LIGHT_STATE.OFF) {
				this.buttonValues[index - 1] = rhit.LightsOutGame.LIGHT_STATE.ON;
			}
		}
		else if (index != 0 && index != 6) {
			if(this.buttonValues[index] == rhit.LightsOutGame.LIGHT_STATE.ON) {
				this.buttonValues[index] = rhit.LightsOutGame.LIGHT_STATE.OFF;
			}
			else if(this.buttonValues[index] == rhit.LightsOutGame.LIGHT_STATE.OFF) {
				this.buttonValues[index] = rhit.LightsOutGame.LIGHT_STATE.ON;
			}
			if(this.buttonValues[index - 1] == rhit.LightsOutGame.LIGHT_STATE.ON) {
				this.buttonValues[index - 1] = rhit.LightsOutGame.LIGHT_STATE.OFF;
			} else if(this.buttonValues[index - 1] = rhit.LightsOutGame.LIGHT_STATE.OFF) {
				this.buttonValues[index - 1] = rhit.LightsOutGame.LIGHT_STATE.ON;
			}
			if(this.buttonValues[index + 1] == rhit.LightsOutGame.LIGHT_STATE.ON) {
				this.buttonValues[index + 1] = rhit.LightsOutGame.LIGHT_STATE.OFF;
			} else if(this.buttonValues[index + 1] = rhit.LightsOutGame.LIGHT_STATE.OFF) {
				this.buttonValues[index + 1] = rhit.LightsOutGame.LIGHT_STATE.ON;
			}
		}
		this.numPresses++;
		console.log(this.numPresses);
		if(this.numPresses == 1) {
			this.state = rhit.LightsOutGame.GAME_STATE.PRESSED_ONE;
		}
		if(this.numPresses > 1) {
			this.state = rhit.LightsOutGame.GAME_STATE.PRESSED;
		}
		this._checkForGameOver();
	}

	_checkForGameOver() {
		let row = "";
		for(let i = 0; i < 7; i++) {
			row += this.buttonValues[i];
		}
		if(row == "1111111" || row == "0000000") {
			this.state = rhit.LightsOutGame.GAME_STATE.WIN;
		}
	}

	getNumAtIndex(index) {
		return this.buttonValues[index];
	}

	getNumPressed() {
		return this.numPresses;
	}

	getState() {
		return this.state;
	}

}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	new rhit.PageController();
};

rhit.main();
