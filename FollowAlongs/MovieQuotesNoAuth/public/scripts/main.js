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
	updateList() {
		console.log("Update List!");
		console.log(`Num Quotes = ${rhit.fbMovieQuotesManager.length}`);

		const newList = htmlToElement('<div id="quoteListContainer">Works!</div>');



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
		this._unsubscribe = this._ref.onSnapshot((querySnapshot) => {

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
   
/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	if(document.querySelector("#listPage")) {
		console.log("You are on the list page.");
		rhit.fbMovieQuotesManager = new rhit.FbMovieQuotesManager();
		new rhit.ListPageController();
	}

	if(document.querySelector("#detailPage")) {
		console.log("You are on the detail page.");
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
