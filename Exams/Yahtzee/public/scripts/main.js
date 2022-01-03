

/** namespace. */
var rhit = rhit || {};



rhit.YahtzeeController = class {
	constructor() {
		this.game = new rhit.YahtzeeRound();
		document.querySelector("#rollButton").onclick = (event) => {
			this.game.roll();
			this.updateView();
		}
		document.querySelector("#newButton").onclick = (event) => {
			this.game = new rhit.YahtzeeRound();
			this.updateView();
		}
		const diceElements = document.querySelectorAll(".die");
		diceElements.forEach((dieImage, index) => {
			dieImage.onclick = (event) => {
				this.game.pressedDieAtIndex(index);
				this.updateView();
			}
		})



		this.updateView(); 
	}

	updateView() {
		document.querySelector("#gameStateText").innerHTML = this.game.roundState;
		const diceElements = document.querySelectorAll(".die");
		console.log(diceElements);
		diceElements.forEach((dieImage, index) => {
			this.game.getDieStateAtIndex(index);

			dieImage.src = `images/die${this.game.getDieValueAtIndex(index)}${this.game.getDieStateAtIndex(index)}.jpg`;
		})


		if(this.game.roundState == rhit.YahtzeeRound.RoundState.ROUND_COMPLETE) {
			document.querySelector("#rollCol").style = "display: none;"
		} else{
			document.querySelector("#rollCol").style = "display: block;"
		}
	}
}


rhit.YahtzeeRound = class {
	static NUM_DICE = 5;

	static DieState = {
		LOCKED: "L",
		KEEP: "K",
		REROLL: "R",
	}

	static RoundState = {
		FIRST_ROLL_DONE: "You have 2 rolls left.",
		SECOND_ROLL_DONE: "You have 1 roll left.",
		ROUND_COMPLETE: "Final result",
	}

	/** constructor */
	constructor() {
		this.roundState = rhit.YahtzeeRound.RoundState.FIRST_ROLL_DONE;
		this.diceStates = [];
		for (let k = 0; k < rhit.YahtzeeRound.NUM_DICE; k++) {
			this.diceStates.push(rhit.YahtzeeRound.DieState.REROLL);
		}
		this.diceValues = [];
		for (let k = 0; k < rhit.YahtzeeRound.NUM_DICE; k++) {
			this.diceValues.push(rhit.YahtzeeRound.getRandomDieValue());
		}
		console.log(`Created YahtzeeRound with ${this.toString()}`);
	}

	// Returns a random value 1 to 6
	// Used internally as a static class method.
	static getRandomDieValue() {
		return Math.floor(Math.random() * 6) + 1;
	}

	// Public method
	pressedDieAtIndex(dieIndex) {
		if (dieIndex < 0 || dieIndex >= rhit.YahtzeeRound.NUM_DICE) {
			console.log(`Invalid dieIndex ${dieIndex}`);
			return; // Not a valid die location
		}
		if (this.state == rhit.YahtzeeRound.RoundState.ROUND_COMPLETE) {
			console.log("This round is over");
			return; // This round is already over.
		}
		switch (this.diceStates[dieIndex]) {
			case rhit.YahtzeeRound.DieState.LOCKED:
				console.log(`The die at index ${dieIndex} is locked.`);
				return; // This dice is locked
			case rhit.YahtzeeRound.DieState.REROLL:
				this.diceStates[dieIndex] = rhit.YahtzeeRound.DieState.KEEP;
				break;
			case rhit.YahtzeeRound.DieState.KEEP:
				this.diceStates[dieIndex] = rhit.YahtzeeRound.DieState.REROLL;
				break;
		}
	}

	// Public method
	roll() {
		this._lockKeepDice();
		switch (this.roundState) {
			case rhit.YahtzeeRound.RoundState.FIRST_ROLL_DONE:
				this._rollActiveDice();
				this.roundState = rhit.YahtzeeRound.RoundState.SECOND_ROLL_DONE;
				return;
			case rhit.YahtzeeRound.RoundState.SECOND_ROLL_DONE:
				this._rollActiveDice();
				this.roundState = rhit.YahtzeeRound.RoundState.ROUND_COMPLETE;
				this._lockAllDice();
				return;
			case rhit.YahtzeeRound.RoundState.ROUND_COMPLETE:
				console.log("Out of rolls already.")
				return; // Notice that the code does not continue.
		}
	}

	// Private method
	_lockKeepDice() {
		this.diceStates.forEach((diceState, index) => {
			if (diceState == rhit.YahtzeeRound.DieState.KEEP) {
				this.diceStates[index] = rhit.YahtzeeRound.DieState.LOCKED;
			}
		});
	}

	// Private method
	_rollActiveDice() {
		this.diceStates.forEach((diceState, index) => {
			if (diceState == rhit.YahtzeeRound.DieState.REROLL) {
				this.diceValues[index] = rhit.YahtzeeRound.getRandomDieValue();
			}
		});
	}

	// Private method
	_lockAllDice() {
		for (let k = 0; k < rhit.YahtzeeRound.NUM_DICE; k++) {
			this.diceStates[k] = rhit.YahtzeeRound.DieState.LOCKED;
		}
	}

	// Getter
	getDieStateAtIndex(dieIndex) {
		return this.diceStates[dieIndex];
	}

	// Getter
	getDieValueAtIndex(dieIndex) {
		return this.diceValues[dieIndex];
	}

	// Getter
	getRoundState() {
		return this.roundState;
	}

	// Optional method used for debugging.  It prints the model object if you call this method.
	toString() {
		let diceStateString = "";
		for (let k = 0; k < rhit.YahtzeeRound.NUM_DICE; k++) {
			diceStateString = `${diceStateString} ${this.diceValues[k]}${this.diceStates[k]}`;
		}
		return `Dice: ${diceStateString}    RoundState: ${this.roundState}`;
	}
};

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	new rhit.YahtzeeController();
};

rhit.main();
