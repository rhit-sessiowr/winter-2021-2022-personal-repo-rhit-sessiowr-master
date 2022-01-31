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

	_createCounter(counter) {
		return htmlToElement(` <div class="col-12 col-md-6 col-lg-4 mt-3">
        <div class="card">
          <button type="button" class="btn delete-button"><i class="material-icons">delete_outline</i></button>
          <h5 class="card-header">${counter.name}</h5>
          <div class="card-body">
            <h5 class="card-title text-center">${counter.value}</h5>
            <div class="row">
              <div class="col-4">
                <button type="button" class="increment-button btn btn-outline-primary btn-block"><i
                    class="material-icons">north</i></button>
              </div>
              <div class="col-4">
                <button type="button" class="reset-button btn btn-outline-primary btn-block"><i
                    class="material-icons">refresh</i></button>
              </div>
              <div class="col-4">
                <button type="button" class="decrement-button btn btn-outline-primary btn-block"><i
                    class="material-icons">south</i></button>
              </div>
            </div>
          </div>
        </div>
      </div>`);
	}

	updateList() {
		console.log("update the list!");
		console.log(`num counters: ${rhit.fbCountersManager.length} `);

		const newList = htmlToElement('<div id="countersList" class="row justify-content-center"></div>');
		for (let i = 0; i < rhit.fbCountersManager.length; i++) {
			const counter = rhit.fbCountersManager.getCounterAtIndex(i);
			console.log(counter);
			const newCounter = this._createCounter(counter);


			newCounter.onclick = (event) => {
				console.log("clicked a card");
			}
			newList.appendChild(newCounter);
		}

		const oldList = document.querySelector("#countersList");
		console.log("---------------OLD LIST-------------");
		console.log(oldList);
		oldList.removeAttribute("id");
		// oldList.hidden = true;
		// oldList.parentElement.appendChild(newList);

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
		this._unsubscribe = this._ref.orderBy(rhit.FB_KEY_CREATED).limit(50).onSnapshot((querySnapshot) => {

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

	update(value) {

	}

	delete() {
		return this._ref.delete();
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