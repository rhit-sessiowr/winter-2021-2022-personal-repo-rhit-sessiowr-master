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
		//Enable on-click listeners
	}

	updateView() {

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
		console.log('this.board = ', this.board);
		console.log('this.state = ', this.state);
		//Make instance variables

	}

	pressedButtonAtIndex(Index) {

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
