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

				
				window.location.href = "/photo.html"
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
