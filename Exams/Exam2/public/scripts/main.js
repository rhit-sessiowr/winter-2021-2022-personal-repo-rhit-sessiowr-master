
/** namespace. */
var rhit = rhit || {};

rhit.FB_COLLECTION_COUNTERS = "Counters";
rhit.FB_KEY_NAME = "name";
rhit.FB_KEY_VALUE = "value";
rhit.FB_KEY_CREATED = "created";
rhit.fbCountersManager = null; 

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}







rhit.ListPageController = class {
	constructor() {
		console.log("created list page controller");


		document.querySelector("#submitAddCounter").onclick = (event) => {
			console.log("added a counter!");
			const name = document.querySelector("#inputName").value;
			rhit.fbCountersManager.add(name);
		}

		$("#addCounterDialog").on("show.bs.modal", (event) => {
			document.querySelector("#inputName").value = "";

		})

		$("#addCounterDialog").on("shown.bs.modal", (event) => {
			document.querySelector("#inputName").focus();
		})

		rhit.fbCountersManager.beginListening(this.updateList.bind(this));
	}

	updateList() {

	}
}

rhit.Counter = class {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}
}

rhit.FbCountersManager = class {
	constructor() {
		console.log("created Counters manager");
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_COUNTERS);
		this._unsubscribe = null;
	}

	add(name) {
		console.log(`name: ${name}`);
		
		this._ref.add({
			[rhit.FB_KEY_NAME]: name,
			[rhit.FB_KEY_VALUE]: 0,
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

	}

	stopListening() {
		this._unsubscribe();
	}

	update(value) {

	}

	delete() {

	}

	get length() {
		return this._documentSnapshots.length;
	}

	getCounterAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const c = new rhit.Counter(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_NAME),
			docSnapshot.get(rhit.FB_KEY_VALUE)
		);

		return c;
	}
}





/* Main */
rhit.main = function () {
	console.log("Ready");

	rhit.fbCountersManager = new rhit.FbCountersManager();
	new rhit.ListPageController();
};

rhit.main();
