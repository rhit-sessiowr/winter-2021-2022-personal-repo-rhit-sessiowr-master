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
		this.game = new rhit.Game();

		const squares = document.querySelectorAll(".square");
		for(const square of squares) {
			square.onclick = (event) => {
				const buttonIndex = parseInt(square.dataset.buttonIndex);
				console.log(buttonIndex);
				this.game.pressedButtonAtIndex(buttonIndex);
				this.updateView();
			}
		}
		document.querySelector("#newGameButton").onclick  = (event) => {
			this.game = new rhit.Game();
			this.updateView();
		}


		this.updateView();



	}

	updateView() {
		const squares = document.querySelectorAll(".square");
		squares.forEach((square,index) => {
			square.innerHTML = this.game.getMarkAtIndex(index);
		});
		document.querySelectorAll("#gameStateText").innerHTML = this.game.state;

	}
}

rhit.Game = class {

	static Mark = {
		X: "X",
		O: "O",
		NONE: " ", 
	}

	static State = {
		X_TURN: "X's Turn",
		O_TURN: "O's Turn",
		X_WIN: "X Wins!",
		O_WIN: "O Wins!", 
		TIE: "Tie Game"
	}



	constructor() {
		this.board = [];
		this.state = rhit.Game.State.X_TURN;
		for (let i = 0;  i < 9; i++) {
			this.board.push(rhit.Game.Mark.NONE);
		}
		

	}

	pressedButtonAtIndex(Index) {
		if(this.state == rhit.Game.State.X_WIN || this.state == rhit.Game.State.O_WIN || this.state == rhit.Game.State.TIE) { 
			return;
		}
		if (this.board[Index] != rhit.Game.Mark.NONE) {
			return;
		}
		if(this.state == rhit.Game.State.X_TURN) {
			this.board[Index] = rhit.Game.Mark.X;
			this.state = rhit.Game.State.O_TURN;
		} else {
			this.board[Index] = rhit.Game.Mark.O;
			this.state = rhit.Game.State.X_TURN;
		}
		this._checkForGameOver();

	}

	_checkForGameOver() {
		
	}

	getMarkAtIndex(Index) {
		return this.board[Index];
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
