
var rhit = rhit || {};
const adminApiUrl = "http://localhost:3000/api/admin/";
//Reference (Note: the Admin api tells you words.  You are an admin.):
// POST   /api/admin/add      with body {"word": "..."} - Add a word to the word list
// GET    /api/admin/words    													- Get all words
// GET    /api/admin/word/:id 													- Get a single word at index
// PUT    /api/admin/word/:id with body {"word": "..."} - Update a word at index
// DELETE /api/admin/word/:id 													- Delete a word at index

const playerApiUrl = "http://localhost:3000/api/player/";
//Reference (The player api never shares the word. It is a secret.):
// GET    /api/player/numwords    											- Get the number of words
// GET    /api/player/wordlength/:id								 		- Get the length of a single word at index
// GET    /api/player/guess/:id/:letter								  - Guess a letter in a word

rhit.AdminController = class {
	constructor() {
		// Note to students, the contructor is done.  You will be implementing the methods one at a time.
		// Connect the buttons to their corresponding methods.
		document.querySelector("#addButton").onclick = (event) => {
			const createWordInput = document.querySelector("#createWordInput");
			this.add(createWordInput.value);
			createWordInput.value = "";
		};
		document.querySelector("#readAllButton").onclick = (event) => {
			this.readAll();
		};
		document.querySelector("#readSingleButton").onclick = (event) => {
			const readIndexInput = document.querySelector("#readIndexInput");
			this.readSingle(parseInt(readIndexInput.value));
			readIndexInput.value = "";
		};
		document.querySelector("#updateButton").onclick = (event) => {
			const updateIndexInput = document.querySelector("#updateIndexInput");
			const updateWordInput = document.querySelector("#updateWordInput");
			this.update(parseInt(updateIndexInput.value), updateWordInput.value);
			updateIndexInput.value = "";
			updateWordInput.value = "";
		};
		document.querySelector("#deleteButton").onclick = (event) => {
			const deleteIndexInput = document.querySelector("#deleteIndexInput");
			this.delete(parseInt(deleteIndexInput.value));
			deleteIndexInput.value = "";
		};
	}

	add(word) {
		if (!word) {
			console.log("No word provided.  Ignoring request.");
			return;
		}
		console.log(`TODO: Add the word ${word} to the backend`);

		// TODO: Add your code here.
		let data = {
			"word": word
		};
		let entry = fetch(adminApiUrl + "add", {
				method: "POST",
				headers: {
					"Content-Type": 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(data => {
				document.querySelector("#createWordInput").value = "";
			})
			.catch((err) => {
				console.log(err);
			})

	}

	readAll() {
		console.log(`TODO: Read all the words from the backend, then update the screen.`);

		// TODO: Add your code here.
		document.querySelector("#readAllOutput").innerHTML = "";
		let allEntries = fetch(adminApiUrl + "words")
			.then(response => response.json())
			.then(data => {
				for (let i = 0; i < data.words.length - 1; i++) {
					document.querySelector("#readAllOutput").innerHTML += data.words[i] + ",";
				}
				document.querySelector("#readAllOutput").innerHTML += data.words[data.words.length - 1];
			});

		// Hint for something you will need later in the process (after backend call(s))
		// document.querySelector("#readAllOutput").innerHTML = "";
	}

	readSingle(index) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		console.log(`TODO: Read the word for index ${index} from the backend, then update the screen.`);

		// TODO: Add your code here.
		let entry = fetch(adminApiUrl + "word/" + index)
			.then(response => response.json())
			.then(data => {
				document.querySelector("#readSingleOutput").innerHTML = data.word;
			});

		// Hint for something you will need later in the process (after backend call(s))
		// document.querySelector("#readSingleOutput").innerHTML = "Result goes here"
	}

	update(index, word) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		if (!word) {
			console.log("No word provided.  Ignoring request.");
			return;
		}
		console.log(`TODO: Update the word ${word} at index ${index} on the backend.`);

		// TODO: Add your code here.
		let data = {
			"word": word,
			"index": index
		};
		fetch(adminApiUrl + 'word/' + index, {
				method: "PUT",
				headers: {
					"Content-Type": 'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(data => {
				document.querySelector("#updateIndexInput").value = "";
				document.querySelector("#updateWordInput").value = "";
			})
			.catch((err) => {
				console.log(err);
			});


	}

	delete(index) {
		if (Number.isNaN(index)) {
			console.log("No index provided.  Ignoring request.");
			return;
		}
		console.log(`TODO: Delete the word at index ${index} from the backend.`);

		// TODO: Add your code here.
		fetch(adminApiUrl + 'word/' + index, {
			method: "DELETE"
		}).then(data => {
			document.querySelector("#deleteIndexInput").value = "";
		})
		.catch((err) => {
			console.log(err);
		});
	}
}

rhit.PlayerController = class {
	constructor() {
		// Note to students, you can declare instance variables here (or later) to track the state for the game in progress.
		this.numWords = null;
		this.wordIndex = null;
		this.randWordLength = null;
		this.guessedLetters= [];
		// Connect the Keyboard inputs
		const keyboardKeys = document.querySelectorAll(".key");
		for (const keyboardKey of keyboardKeys) {
			keyboardKey.onclick = (event) => {
				console.log(keyboardKey.dataset.key);
				this.handleKeyPress(keyboardKey.dataset.key);
			};
		}
		// Connect the new game button
		document.querySelector("#newGameButton").onclick = (event) => {
			this.handleNewGame();
		}
		this.handleNewGame(); // Start with a new game.
	}

	getRndInteger(min, max) {
		return Math.floor(Math.random() * (max - min) ) + min;
	}

	replaceAt = function (str,index, char) {
		let a = str.split("");
		a[index] = char;
		return a.join("");
	}

	handleNewGame() {
		console.log(`TODO: Create a new game and update the view (after the backend calls).`);
		// TODO: Add your code here.
		this.numWords = null;
		this.wordIndex = null;
		this.randWordLength = null;
		this.guessedLetters= [];
		document.querySelector("#incorrectLetters").innerHTML = "";
		const keyboardKeys = document.querySelectorAll(".key");
		for (const keyboardKey of keyboardKeys) {
			keyboardKey.style.visibility = "initial";
		}
		fetch(playerApiUrl + "numwords")
		.then(response => response.json())
		.then(data => {
			console.log(data.length);
			this.numWords = data.length;
			this.wordIndex = this.getRndInteger(0, data.length);
			console.log("Word Index: ", this.wordIndex);

			fetch(playerApiUrl + "wordlength/" + this.wordIndex)
			.then(response => response.json())
			.then(data => {
				this.randWordLength = data.length;
				console.log("Random Word Length: ", this.randWordLength);
				document.querySelector("#displayWord").innerHTML = "";
				for(let i = 0; i < this.randWordLength; i++) {
					document.querySelector("#displayWord").innerHTML += "_";
				}
			});
		});
		
		this.updateView();

	}

	handleKeyPress(keyValue) {
		console.log(`You pressed the ${keyValue} key`);

		// TODO: Add your code here.
		this.guessedLetters.push(keyValue);
		console.log(this.guessedLetters);
		this.updateView();

	}

	updateView() {
		console.log(`TODO: Update the view.`);
		// TODO: Add your code here.
		let word = document.querySelector("#displayWord").innerHTML;
		document.querySelector("#incorrectLetters").innerHTML = "";
		const keyboardKeys = document.querySelectorAll(".key");
		for (const keyboardKey of keyboardKeys) { 
			for(let i = 0; i < this.guessedLetters.length; i++) {
				if(keyboardKey.dataset.key == this.guessedLetters[i]) {
					keyboardKey.style.visibility = "hidden";
				} 
			}
		};

		for(let i = 0; i < this.guessedLetters.length; i++) {
			fetch(playerApiUrl + `guess/${this.wordIndex}/${this.guessedLetters[i]}`)
			.then(response => response.json())
			.then(data => {
				if(data.locations.length == 0) {
					console.log("incorrect letter bozo.");
					document.querySelector("#incorrectLetters").innerHTML += this.guessedLetters[i];
				} else {
					for(let j = 0; j < data.locations.length; j++) {
						for(let k = 0; k < this.randWordLength; k++) {
							if (k == data.locations[j]) {
								word = this.replaceAt(word, k, this.guessedLetters[i]);
								document.querySelector("#displayWord").innerHTML = word;

							} 
						}
					}
				}
			});
		}
		


		// Some hints to help you with updateView.
		// 	document.querySelector("#displayWord").innerHTML = "____";
		// 	document.querySelector("#incorrectLetters").innerHTML = "ABCDE";

		// 	const keyboardKeys = document.querySelectorAll(".key");
		// 	for (const keyboardKey of keyboardKeys) {
		// 		if (some condition based on keyboardKey.dataset.key) {
		// 			keyboardKey.style.visibility = "hidden";
		// 		} else {
		// 			keyboardKey.style.visibility = "initial";
		// 		}
		// 	}
	}
}

/* Main */
rhit.main = function () {
	console.log("Ready");
	if (document.querySelector("#adminPage")) {
		console.log("On the admin page");
		new rhit.AdminController();
	}
	if (document.querySelector("#playerPage")) {
		console.log("On the player page");
		new rhit.PlayerController();
	}
};

rhit.main();