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
		for (const square of squares) {
			square.onclick = (event) => {
				const buttonIndex = parseInt(square.dataset.buttonIndex);
				this.game.pressedButtonAtIndex(buttonIndex);
				this.updateView();
			}
		}
		document.querySelector("#newGameButton").onclick = (event) => {
			this.game = new rhit.Game();
			this.updateView();
		}


		this.updateView();



	}

	updateView() {
		const squares = document.querySelectorAll(".square");
		squares.forEach((square, index) => {
			square.innerHTML = this.game.getMarkAtIndex(index);
		});
		document.querySelector("#gameStateText").innerHTML = this.game.state;


		if (this.game.isOTurn) {
			const boardString = this.game.boardString;
			console.log("computer takes a turn bozo Board: ", boardString);

			fetch(`/api/getmove/${boardString}`).then((res) => {
				console.log(res);
				return res.json();
			}).then((data) => {
				console.log(data);
			});


			
		}



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
		for (let i = 0; i < 9; i++) {
			this.board.push(rhit.Game.Mark.NONE);
		}


	}

	pressedButtonAtIndex(Index) {
		if (this.state == rhit.Game.State.X_WIN || this.state == rhit.Game.State.O_WIN || this.state == rhit.Game.State.TIE) {
			return;
		}
		if (this.board[Index] != rhit.Game.Mark.NONE) {
			return;
		}
		if (this.state == rhit.Game.State.X_TURN) {
			this.board[Index] = rhit.Game.Mark.X;
			this.state = rhit.Game.State.O_TURN;
		} else {
			this.board[Index] = rhit.Game.Mark.O;
			this.state = rhit.Game.State.X_TURN;
		}
		this._checkForGameOver();

	}

	_checkForGameOver() {
		if (!this.board.includes(rhit.Game.Mark.NONE)) {
			this.state = rhit.Game.State.TIE;
		}

		const lines = [];
		if (!this.board.includes(rhit.Game.Mark.NONE)) {
			this.state = rhit.Game.State.TIE;
		}
		lines.push(this.board[0] + this.board[1] + this.board[2])
		lines.push(this.board[3] + this.board[4] + this.board[5])
		lines.push(this.board[6] + this.board[7] + this.board[8])

		lines.push(this.board[0] + this.board[3] + this.board[6])
		lines.push(this.board[1] + this.board[4] + this.board[7])
		lines.push(this.board[2] + this.board[5] + this.board[8])

		lines.push(this.board[0] + this.board[4] + this.board[8])
		lines.push(this.board[2] + this.board[4] + this.board[6])

		for (const line of lines) {
			if (line == "XXX") {
				this.state = rhit.Game.State.X_WIN;
			} else if (line == "OOO") {
				this.state = rhit.Game.State.O_WIN;
			}
		}

	}

	getMarkAtIndex(Index) {
		return this.board[Index];
	}

	getState() {
		return this.state;
	}

	get isOTurn() {
		return this.state == rhit.Game.State.O_TURN;
	}

	get boardString() {
		let boardString = "";
		for (let k = 0; k < 9; k++) {
			if (this.board[k] == rhit.Game.Mark.NONE) {
				boardString += "-";
			} else {
				boardString += this.board[k];
			}
		}
		return boardString;
	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	new rhit.PageController();
};

rhit.main();