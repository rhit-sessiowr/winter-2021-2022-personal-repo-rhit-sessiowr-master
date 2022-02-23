const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

// Setup
const app = express();
app.use('/', express.static("public"));
app.use('/api/', bodyParser.urlencoded({
    extended: true
}));
app.use('/api/', bodyParser.json());

// Data from a file.
let data = [];
const serverSideStorage = "../data/db.json";
fs.readFile(serverSideStorage, function (err, buf) {
    if (err) {
        console.log("error: ", err);
    } else {
        data = JSON.parse(buf.toString());
    }
    console.log("Data read from file.");
});

function saveToServer(data) {
    fs.writeFile(serverSideStorage, JSON.stringify(data), function (err, buf) {
        if (err) {
            console.log("error: ", err);
        } else {
            console.log("Data saved successfully!");
        }
    })
}

/**
 * Get Days	- Gets the array of week days in order
 *   method:                    GET
 *   path:                      /api/getdays
 *   expected request body:     none
 *   side effects:              none
 *   example response:          ["Saturday","Sunday","Friday","Thursday","Wednesday","Tuesday","Monday"]
 */
app.get("/api/getdays", function (req, res) {
    res.send(data);
    res.end();
});

/**
 * Move - Sets the index for one of the days of the week
 *   method:                    PUT
 *   path:                      /api/move/:fromindex/:toindex
 *   expected request body:     none
 *   side effects:              adjusts the order of the array
 *   example response:          {"days": ["Saturday","Sunday","Friday","Thursday","Wednesday","Tuesday","Monday"],
 *                               "moved_day": "Sunday", 
 *                               "from_index": 0,
 *                               "to_index": 1}
*/
app.put("/api/move/:fromindex/:toindex", function (req, res) {
    let fromIndex = parseInt(req.params.fromindex);
    let toIndex = parseInt(req.params.toindex);
    const dayMoved = data.splice(fromIndex, 1)[0]; // Does the splice and returns the day
    data.splice(toIndex, 0, dayMoved);  // Inserts the day back into the array at the index
    res.send({"days": data, "moved_day": dayMoved, "from_index": fromIndex, "to_index": toIndex});
    res.end();
});


app.listen(3000);