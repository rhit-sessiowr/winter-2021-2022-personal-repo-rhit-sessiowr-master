/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Will Sessions
 */


/** namespace. */
var rhit = rhit || {};

rhit.FB_COLLECTION_MOVIEQUOTES = "MovieQuotes";
rhit.FB_KEY_QUOTE = "quote";
rhit.FB_KEY_MOVIE = "movie";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.fbMovieQuotesManager = null;
rhit.fbSingleQuoteManager = null;
rhit.fbAuthManager = null;


//From: https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}


rhit.ListPageController = class {
	constructor() {
		// document.querySelector("#submitAddQuote").onclick = (event) => {

		// }
		document.querySelector("#submitAddQuote").addEventListener("click", (event) => {
			const quote = document.querySelector("#inputQuote").value;
			const movie = document.querySelector("#inputMovie").value;
			rhit.fbMovieQuotesManager.add(quote, movie);


		})

		$("#addQuoteModal").on("show.bs.modal", (event) => {
			document.querySelector("#inputQuote").value = "";
			document.querySelector("#inputMovie").value = "";

		})

		$("#addQuoteModal").on("shown.bs.modal", (event) => {
			document.querySelector("#inputQuote").focus();
		})

		rhit.fbMovieQuotesManager.beginListening(this.updateList.bind(this));
	}

	_createCard(movieQuote) {
		return htmlToElement(`<div class="card">
        <div class="card-body">
          <h5 class="card-title">${movieQuote.quote}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${movieQuote.movie}</h6>
        </div>
      </div>`);

	}

	updateList() {
		console.log("Update List!");
		console.log(`Num Quotes = ${rhit.fbMovieQuotesManager.length}`);

		const newList = htmlToElement('<div id="quoteListContainer"></div>');
		for (let i = 0; i < rhit.fbMovieQuotesManager.length; i++) {
			const mq = rhit.fbMovieQuotesManager.getMovieQuoteAtIndex(i);
			const newCard = this._createCard(mq);


			newCard.onclick = (event) => {
				console.log("clicked a card")
				// rhit.storage.setMovieQuoteId(mq.id);
				window.location.href = `/moviequote.html?id=${mq.id}`
			}
			newList.appendChild(newCard);
		}
		const oldList = document.querySelector("#quoteListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}
}

rhit.MovieQuote = class {
	constructor(id, quote, movie) {
		this.id = id;
		this.quote = quote;
		this.movie = movie;

	}
}

rhit.FbMovieQuotesManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTES);
		this._unsubscribe = null;
	}
	add(quote, movie) {
		console.log(`quote ${quote}`);
		console.log(`movie ${movie}`);

		// Add a new document with a generated id.
		this._ref.add({
				[rhit.FB_KEY_QUOTE]: quote,
				[rhit.FB_KEY_MOVIE]: movie,
				[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then((docRef) => {
				console.log("Document written with ID: ", docRef.id);
			})
			.catch((error) => {
				console.error("Error adding document: ", error);
			});
	}
	beginListening(changeListener) {
		this._unsubscribe = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc").limit(50).onSnapshot((querySnapshot) => {

			this._documentSnapshots = querySnapshot.docs;

			// querySnapshot.forEach((doc) => {
			// 	console.log(doc.data());
			// });

			changeListener();


		});
	}
	stopListening() {
		this._unsubscribe();
	}
	// update(id, quote, movie) {    }
	// delete(id) { }
	get length() {
		return this._documentSnapshots.length;
	}
	getMovieQuoteAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const mq = new rhit.MovieQuote(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_QUOTE),
			docSnapshot.get(rhit.FB_KEY_MOVIE)
		);

		return mq;
	}
}


rhit.DetailPageController = class {
	constructor() {
		document.querySelector("#submitEditQuote").addEventListener("click", (event) => {
			const quote = document.querySelector("#inputQuote").value;
			const movie = document.querySelector("#inputMovie").value;
			rhit.fbSingleQuoteManager.update(quote, movie);


		})

		$("#editQuoteModal").on("show.bs.modal", (event) => {
			document.querySelector("#inputQuote").value = rhit.fbSingleQuoteManager.quote;
			document.querySelector("#inputMovie").value = rhit.fbSingleQuoteManager.movie;

		})

		$("#editQuoteModal").on("shown.bs.modal", (event) => {
			document.querySelector("#inputQuote").focus();
		})

		document.querySelector("#submitDeleteQuote").addEventListener("click", (event) => {
			rhit.fbSingleQuoteManager.delete().then(() => {
				console.log("Document successfully deleted!");
				window.location.href = "/";
			}).catch((error) => {
				console.error("Error removing document: ", error);
			});


		})


		rhit.fbSingleQuoteManager.beginListening(this.updateView.bind(this));
	}
	updateView() {
		document.querySelector("#cardQuote").innerHTML = rhit.fbSingleQuoteManager.quote;
		document.querySelector("#cardMovie").innerHTML = rhit.fbSingleQuoteManager.movie;
	}
}

rhit.FbSingleQuoteManager = class {
	constructor(movieQuoteId) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTES).doc(movieQuoteId);
		console.log(`listening to ${this._ref.path}`);
	}
	beginListening(changeListener) {

		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Document data:", doc.data());
				this._documentSnapshot = doc;
				changeListener();
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		})

	}
	stopListening() {
		this._unsubscribe();
	}
	update(quote, movie) {
		this._ref.update({
				[rhit.FB_KEY_QUOTE]: quote,
				[rhit.FB_KEY_MOVIE]: movie,
				[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then(() => {
				console.log("Document successfully updated!");
			})
			.catch((error) => {
				console.error("Error updating document: ", error);
			});
	}
	delete() {
		return this._ref.delete();
	}

	get quote() {
		return this._documentSnapshot.get(rhit.FB_KEY_QUOTE);
	}

	get movie() {
		return this._documentSnapshot.get(rhit.FB_KEY_MOVIE);
	}
}



// rhit.storage = rhit.storage || {};
// rhit.storage.MOVIEQUOTE_ID_KEY = "movieQuoteId";
// rhit.storage.getMovieQuoteId = function () {
// 	const mqId = sessionStorage.getItem(rhit.storage.MOVIEQUOTE_ID_KEY);
// 	if (!mqId) {
// 		console.log("no movie quote id in session storage");
// 	}
// 	return mqId;
// }
// rhit.storage.setMovieQuoteId = function (movieQuoteId) {
// 	sessionStorage.setItem(rhit.storage.MOVIEQUOTE_ID_KEY, movieQuoteId);

// }


rhit.LoginPageController = class {
	constructor() {
		console.log("You have made the login page controller");
	}
}

rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
		console.log("You have made the Auth Manager");
	}
	beginListening(changeListener) {}
	signIn() {}
	signOut() {}
	get isSignedIn() {}
	get uid() {}
}



/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	rhit.fbAuthManager = new rhit.FbAuthManager();

	if (document.querySelector("#listPage")) {
		console.log("You are on the list page.");
		rhit.fbMovieQuotesManager = new rhit.FbMovieQuotesManager();
		new rhit.ListPageController();
	}

	if (document.querySelector("#detailPage")) {
		console.log("You are on the detail page.");

		// const movieQuoteId = rhit.storage.getMovieQuoteId();
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const movieQuoteId = urlParams.get("id");

		console.log(`Detail page for ${movieQuoteId}`);
		if (!movieQuoteId) {
			console.log("error! missing movie quote id!");
			window.location.href = "/";
		}
		rhit.fbSingleQuoteManager = new rhit.FbSingleQuoteManager(movieQuoteId);
		new rhit.DetailPageController();
	}

	if (document.querySelector("#loginPage")) {
		console.log("You are on the login page.");
		new rhit.LoginPageController();
	}



	//Temp code for read and add
	// const ref = firebase.firestore().collection("MovieQuotes");
	// ref.onSnapshot((querySnapshot) => {
	// 	querySnapshot.forEach((doc) => {
	// 		console.log(doc.data());
	// 	});
	// });

	// ref.add({
	// 	quote: "my first test",
	// 	movie: "my first movie"

	// });


};

rhit.main();