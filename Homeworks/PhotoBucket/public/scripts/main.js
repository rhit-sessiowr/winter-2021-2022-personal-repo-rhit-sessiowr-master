/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Will Sessions
 */

/** namespace. */
var rhit = rhit || {};

rhit.FB_COLLECTION_PHOTOBUCKET = "PhotoBucket";
rhit.FB_KEY_IMAGEURL = "imageUrl";
rhit.FB_KEY_CAPTION = "caption";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.fbPhotosManager = null;
rhit.fbSinglePhotoManager = null;
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
		document.querySelector("#submitAddPhoto").onclick = (event) => {
			const imageUrl = document.querySelector("#inputImageUrl").value;
			const caption = document.querySelector("#inputCaption").value;
			rhit.fbPhotosManager.add(imageUrl, caption);

			
		}

		$("#addPhotoModal").on("show.bs.modal", (event) => {
			document.querySelector("#inputImageUrl").value = "";
			document.querySelector("#inputCaption").value = "";

		})

		$("#addPhotoModal").on("shown.bs.modal", (event) => {
			document.querySelector("#inputImageUrl").focus();		
		})


		rhit.fbPhotosManager.beginListening(this.updateList.bind(this));
	}


	
	

	updateList() {
		const newList = htmlToElement('<div id="photoContainer"></div>');
		for(let i = 0; i < rhit.fbPhotosManager.length; i++) {
			const photo = rhit.fbPhotosManager.getPhotoAtIndex(i);
			const newPin = this._createPin(photo);
			newPin.onclick = (event) => {
				window.location.href = `/photo.html?id=${photo.id}`
			}
			newList.appendChild(newPin);
		}


		const oldList = document.querySelector("#photoContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;

		oldList.parentElement.appendChild(newList);


	}

	_createPin(photo) {
		return htmlToElement(`<div class="pin"><img
		src="${photo.imageUrl}" class="img-fluid"
		alt="${photo.caption}">
	  <p class="caption">${photo.caption}</p>
	</div>`)
	}
}

rhit.Photo = class {
	constructor(id, imageUrl, caption) {
		this.id = id;
		this.imageUrl = imageUrl;
		this.caption = caption;
	}
}

rhit.FbPhotosManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PHOTOBUCKET);
		this._unsubscribe = null;
	}

	add(imageUrl, caption) {
		this._ref.add({
			[rhit.FB_KEY_IMAGEURL]: imageUrl,
			[rhit.FB_KEY_CAPTION]: caption,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now()
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
			changeListener();

			// querySnapshot.forEach((doc) => {
			// 	console.log(doc.data());
			// });
		});

	}

	stopListening() {
		this._unsubscribe();
	}

	// update(id, imageUrl, caption) {

	// }

	// delete(id) {

	// }

	get length() {
		return this._documentSnapshots.length;
	}

	getPhotoAtIndex(index) {
		const docSnapshot  = this._documentSnapshots[index];
		const photo = new rhit.Photo(
			docSnapshot.id, docSnapshot.get(rhit.FB_KEY_IMAGEURL), docSnapshot.get(rhit.FB_KEY_CAPTION)
		)
		return photo;
	}
}

rhit.DetailPageController = class {
	constructor() {

		document.querySelector("#submitUpdatePhoto").addEventListener("click", (event) => {
			const caption = document.querySelector("#inputCaption").value;
			rhit.fbSinglePhotoManager.update(caption);
		})

		$("#editPhotoModal").on("show.bs.modal", (event) => {
			document.querySelector("#inputCaption").value = rhit.fbSinglePhotoManager.caption;
		})
		$("#editPhotoModal").on("shown.bs.modal", (event) => {
			document.querySelector("#inputCaption").focus();
		})

		document.querySelector("#submitDeletePhoto").addEventListener("click", (event) => {
			rhit.fbSinglePhotoManager.delete().then(() => {
				console.log("Document successfully deleted!");
				window.location.href = "/";
			}).catch((error) => {
				console.error("Error removing document: ", error);
			});
		})

		rhit.fbSinglePhotoManager.beginListening(this.updateView.bind(this));
	}

	updateView() {
		console.log("update the view");
		document.querySelector("#photoUrl").src = rhit.fbSinglePhotoManager.imageUrl;
		document.querySelector("#photoCaption").innerHTML = rhit.fbSinglePhotoManager.caption;
	}
}

rhit.FbSinglePhotoManager = class {
	constructor(photoId) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PHOTOBUCKET).doc(photoId);
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

	update(caption) {
		this._ref.update({
			[rhit.FB_KEY_CAPTION]: caption,
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

	get caption() {
		return this._documentSnapshot.get(rhit.FB_KEY_CAPTION);
	}

	get imageUrl() {
		return this._documentSnapshot.get(rhit.FB_KEY_IMAGEURL);
	}

}

rhit.LoginPageController = class {
	constructor() {
	}
}

rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
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

	if(document.querySelector("#loginPage")) {
		console.log("This is the login page.");
		new rhit.LoginPageController();

	}

	if(document.querySelector("#listPage")) {
		console.log("This is the list page.");
		rhit.fbPhotosManager = new rhit.FbPhotosManager();
		new rhit.ListPageController();

	}

	if(document.querySelector("#detailPage")) {
		console.log("This is the detail page.");

		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString)
		const photoId = urlParams.get("id");
		if(!photoId) {
			window.location.href = "/"
		} 

		rhit.fbSinglePhotoManager = new rhit.FbSinglePhotoManager(photoId);
		new rhit.DetailPageController();

	}

	rhit.startFirebaseUI();


	//Temp code
	// const ref = firebase.firestore().collection("PhotoBucket");
	// ref.onSnapshot((querySnapshot) => {
	// 	querySnapshot.forEach((doc) => {
	// 		console.log(doc.data());
	// 	});
	// })

	// ref.add({
	// 	imageUrl: "test",
	// 	caption: "test"
	// });
};

rhit.startFirebaseUI = function() {
	// FirebaseUI config.
	var uiConfig = {
	   signInSuccessUrl: '/',
	   signInOptions: [
		 // Leave the lines as is for the providers you want to offer your users.
		 firebase.auth.GoogleAuthProvider.PROVIDER_ID,
		 firebase.auth.EmailAuthProvider.PROVIDER_ID,
		 firebase.auth.PhoneAuthProvider.PROVIDER_ID,
		 firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
	   ],
	 };

	 // Initialize the FirebaseUI Widget using Firebase.
	 const ui = new firebaseui.auth.AuthUI(firebase.auth());
	 // The start method will wait until the DOM is loaded.
	 ui.start('#firebaseui-auth-container', uiConfig);
}

rhit.main();
