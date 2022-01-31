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
			console.log(counter.value);


			newCounter.querySelector(".increment-button").onclick = (event) => {
				console.log("increment!");
				const value = counter.value + 1;
				rhit.fbCountersManager.update(counter.id,value);
			}
			newList.appendChild(newCounter);

			newCounter.querySelector(".decrement-button").onclick = (event) => {
				console.log("decrement!");
				rhit.fbCountersManager.update(counter.id, counter.value - 1);
			}

			newCounter.querySelector(".reset-button").onclick = (event) => {
				console.log("reset!");
				rhit.fbCountersManager.update(counter.id, 0);
			}
			newCounter.querySelector(".delete-button").onclick = (event) => {
				console.log("delete!");
				rhit.fbCountersManager.delete(counter.id).then(() => {
					console.log("Document successfully deleted!");
				}).catch((error) => {
					console.error("Error removing document: ", error);
				});
			}
		}

		const oldList = document.querySelector("#countersList");
		console.log("---------------OLD LIST-------------");
		console.log(oldList);
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);

	}
}

rhit.Counter = class {
	constructor(id, name, value) {
		this.id = id;
		this.name = name;
		this.value = value;
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

	update(id, value) {
		this._ref.doc(id).update({
			[rhit.FB_KEY_VALUE]: value,
		})
		.then(() => {
			console.log("Document successfully updated!");
		})
		.catch((error) => {
			console.error("Error updating document: ", error);
		});

	}

	delete(id) {
		return this._ref.doc(id).delete();
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