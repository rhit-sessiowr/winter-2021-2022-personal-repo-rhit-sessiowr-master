
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







rhit.ClassName = class {
	constructor() {

	}

	methodName() {

	}
}





/* Main */
rhit.main = function () {
	console.log("Ready");
};

rhit.main();
