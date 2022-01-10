/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Will Sessions
 */

/** namespace. */
var rhit = rhit || {};



rhit.CantStopController = class {
	constructor() {
		this.game = new rhit.CantStopGame();
		this.player1Score = 0;
		this.player2Score = 0;
		document.querySelector("#keepButton").onclick = (event) => {
			this.game.keepRolling();
			this.updateView()
		}

		document.querySelector("#stopButton").onclick = (event) => {
			this.game.stopRolling();
			this.updateView();
		}

		document.querySelector("#bustButton").onclick = (event) => {
			this.game.nextPlayer();
			this.updateView();
		}

		this.updateView();
	}

	updateView() {
		const diceElements = document.querySelectorAll(".die");
		console.log(diceElements);
		diceElements.forEach((dieImage, index) => {
			dieImage.src = `Images/die${this.game.getDieValueAtIndex(index)}.jpg`;
		})

		if(this.game.roundState == rhit.CantStopGame.RoundState.PLAYER_1_ACTIVE) {
			document.querySelector("#player1Body").innerHTML = `Total : 0 <br>Current Round: ${this.game.currentRoundScore}`;
			document.querySelector("#player2Body").innerHTML = "Total : " + this.player2Score;
			this.player1Score += this.game.currentRoundScore;
			console.log("Player 1 Score: " + this.player1Score);
			document.querySelector("#keepCol").style = "display: block;"
			document.querySelector("#stopCol").style = "display: block;"
			document.querySelector("#bustCol").style = "display: none;"
		}
		else if(this.game.roundState == rhit.CantStopGame.RoundState.PLAYER_2_ACTIVE) {
			document.querySelector("#player1Body").innerHTML = "Total : " + this.player1Score;
			document.querySelector("#player2Body").innerHTML = `Total : 0 <br>Current Round: ${this.game.currentRoundScore}`;
			this.player2Score += this.game.currentRoundScore;
			document.querySelector("#keepCol").style = "display: block;"
			document.querySelector("#stopCol").style = "display: block;"
			document.querySelector("#bustCol").style = "display: none;"
		}
		if(this.game.roundState == rhit.CantStopGame.RoundState.PLAYER_1_BUST) {
			document.querySelector("#keepCol").style = "display: none;"
			document.querySelector("#stopCol").style = "display: none;"
			document.querySelector("#bustCol").style = "display: block;"
			document.querySelector("#player1Body").innerHTML = `Total : 0 <br>Current Round: BUST!`;
		} 
		 if(this.game.roundState == rhit.CantStopGame.RoundState.PLAYER_2_BUST){
			document.querySelector("#keepCol").style = "display: none;"
			document.querySelector("#stopCol").style = "display: none;"
			document.querySelector("#bustCol").style = "display: block;"
			// document.querySelector("#player2Body").innerHTML = `Total : 0 <br>Current Round: BUST!`;
		}


	}
}

rhit.CantStopGame = class {
	static NUM_DICE = 3; // Hardcoded but easy to change if making a different game.
	static MAX_FIRST_ROLL_VALUE = 3; // Hardcoded but easy to change

	static RoundState = {
		PLAYER_1_ACTIVE: "Player 1's Turn",
		PLAYER_1_BUST: "Player 1 Bust!",
		PLAYER_2_ACTIVE: "Player 2's Turn",
		PLAYER_2_BUST: "Player 2 Bust!",
	}

	/** constructor */
	constructor() {
		this.roundState = rhit.CantStopGame.RoundState.PLAYER_1_ACTIVE;
		this.player1Score = 0;
		this.player2Score = 0;
		this.currentRoundScore = 0;
		this.diceValues = []; // Example [1, 5, 4]
		for (let k = 0; k < rhit.CantStopGame.NUM_DICE; k++) {
			this.diceValues.push(0);  // Just creating an array the correct size.
		}
		this._initialRollDice();
		console.log(`Created CantStopGame with ${this.toString()}`);
	}

	// Returns a random value 1 to 6 (or maxValue if provided)
	// Used internally as a static class method.
	static getRandomDieValue(maxValue = 6) {
		return Math.floor(Math.random() * maxValue) + 1;
	}

	// Public method - used from an active state
	keepRolling() {
		switch (this.roundState) {
			case rhit.CantStopGame.RoundState.PLAYER_1_ACTIVE:
			case rhit.CantStopGame.RoundState.PLAYER_2_ACTIVE:
				this._rollDice();
				return;
			case rhit.CantStopGame.RoundState.PLAYER_1_BUST:
			case rhit.CantStopGame.RoundState.PLAYER_2_BUST:
				console.log("This player has gone bust and cannot continue to roll.  Check your code.");
				return;
		}
	}

	// Public method - used from an active state
	stopRolling() {
		switch (this.roundState) {
			case rhit.CantStopGame.RoundState.PLAYER_1_ACTIVE:
				this.player1Score += this.currentRoundScore;
				this.nextPlayer();
				return;
			case rhit.CantStopGame.RoundState.PLAYER_2_ACTIVE:
				this.player2Score += this.currentRoundScore;
				this.nextPlayer();
				return;
			case rhit.CantStopGame.RoundState.PLAYER_1_BUST:
			case rhit.CantStopGame.RoundState.PLAYER_2_BUST:
				console.log("This player has gone bust and cannot stop.  Check your code.");
				return;
		}
	}

	// Public method - to be used from the BUST state
	nextPlayer() {
		switch (this.roundState) {
			case rhit.CantStopGame.RoundState.PLAYER_1_ACTIVE:
			case rhit.CantStopGame.RoundState.PLAYER_1_BUST:
				this.roundState = rhit.CantStopGame.RoundState.PLAYER_2_ACTIVE;
				break;
			case rhit.CantStopGame.RoundState.PLAYER_2_ACTIVE:
			case rhit.CantStopGame.RoundState.PLAYER_2_BUST:
				this.roundState = rhit.CantStopGame.RoundState.PLAYER_1_ACTIVE;
				break;
		}
		this._initialRollDice();
	}

	// Private methods - You should not call or use these method.
	_initialRollDice() {
		this.currentRoundScore = 0;
		this.diceValues.forEach((diceValue, index) => {
			const randValue = rhit.CantStopGame.getRandomDieValue(rhit.CantStopGame.MAX_FIRST_ROLL_VALUE);
			this.currentRoundScore += randValue;
			this.diceValues[index] = randValue;
		});
	}

	_rollDice() {
		let numSixes = 0;
		let total = 0;
		this.diceValues.forEach((diceValue, index) => {
			const randValue = rhit.CantStopGame.getRandomDieValue();
			if (randValue == 6) {
				numSixes++;
			}
			total += randValue;
			this.diceValues[index] = randValue;
		});
		switch (this.roundState) {
			case rhit.CantStopGame.RoundState.PLAYER_1_ACTIVE:
				if (numSixes == 1) {
					// Player 1 has gone bust!
					this.roundState = rhit.CantStopGame.RoundState.PLAYER_1_BUST;
					this.currentRoundScore = 0;
				} else {
					this.currentRoundScore += total;
				}
				return;
			case rhit.CantStopGame.RoundState.PLAYER_2_ACTIVE:
				if (numSixes == 1) {
					// Player 2 has gone bust!
					this.roundState = rhit.CantStopGame.RoundState.PLAYER_2_BUST;
					this.currentRoundScore = 0;
				} else {
					this.currentRoundScore += total;
				}
				return;
			case rhit.CantStopGame.RoundState.PLAYER_1_BUST:
			case rhit.CantStopGame.RoundState.PLAYER_2_BUST:
				console.log("Error!  A bust player just rolled! Check your code.");
				return;
		}
	}

	// Getter - Optional helper to get values from the array
	getDieValueAtIndex(dieIndex) {
		return this.diceValues[dieIndex];
	}

	// Optional method used for debugging.  It prints the model object if you call this method.
	toString() {
		return `Dice: ${this.diceValues.join(' ')}  Scores: ${this.player1Score}|${this.player2Score}|${this.currentRoundScore} RoundState: ${this.roundState}`;
	}
};

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	new rhit.CantStopController();
};

rhit.main();
