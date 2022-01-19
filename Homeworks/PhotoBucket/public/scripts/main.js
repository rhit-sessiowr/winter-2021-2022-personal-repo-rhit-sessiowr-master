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

rhit.ListPageController = class {
	constructor() {
		document.querySelector("#submitAddPhoto").onclick = (event) => {
			const imageUrl = document.querySelector("#inputImageUrl").value;
			const caption = document.querySelector("#inputCaption").value;
			rhit.fbPhotosManager.add(imageUrl, caption);
		}
	}

	methodName() {

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

	}

	stopListening() {

	}

	// update(id, imageUrl, caption) {

	// }

	// delete(id) {

	// }

	get length() {

	}

	getPhotoAtIndex(index) {

	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	if(document.querySelector("#listPage")) {
		console.log("This is the list page.");
		rhit.fbPhotosManager = new rhit.FbPhotosManager();
		new rhit.ListPageController();

	}

	if(document.querySelector("#detailPage")) {
		console.log("This is the detail page.");

	}

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

rhit.main();
