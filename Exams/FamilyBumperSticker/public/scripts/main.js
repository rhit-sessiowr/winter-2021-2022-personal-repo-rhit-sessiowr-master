var rhit = rhit || {};
rhit.FB_COLLECTION_FAMILYMEMBERS = "familyMembers";
rhit.FB_NAME = "name";
rhit.FB_IMAGE_URL = "imageUrl";
rhit.FB_KEY_CREATED = "created";
rhit.fbFamilyMembersManager = null;
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.ViewController = class {
	constructor() {
		document.querySelector("#submit").onclick = (event) => {
			const nameInputEl = document.querySelector("#nameInput");
			const imageInputEl = document.querySelector("#pictureInput");
			console.log(nameInputEl.value);
			console.log(imageInputEl.value);

			//Send name to firestore
			rhit.fbFamilyMembersManager.add(nameInputEl.value, imageInputEl.value);

			nameInputEl.value = "";
			imageInputEl.selectedIndex = 0;
		}


		this.updateView();
	}

	updateView() {

	}
}

rhit.FamilyMember = class {
	constructor(id, name, imageUrl) {
		this.id = id;
		this.name = name;
		this.imageUrl = imageUrl;

	}
}

rhit.FbFamilyMembersManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_FAMILYMEMBERS);
		this._unsubscribe = null;
	}
	add(name, imageUrl) {
		console.log(`quote ${name}`);
		console.log(`movie ${imageUrl}`);

		// Add a new document with a generated id.
		this._ref.add({
				[rhit.FB_NAME]: name,
				[rhit.FB_IMAGE_URL]: imageUrl,
				[rhit.FB_KEY_CREATED]: firebase.firestore.Timestamp.now(),
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

/* Main */
rhit.main = function () {
	console.log("Ready");
	rhit.fbFamilyMembersManager = new rhit.FbFamilyMembersManager();
	new rhit.ViewController();

};

rhit.main();
