var express = require('express');
var app = express();

let data = [];

const logger = require("morgan");
app.use(logger('dev'));

const fs = require("fs");
const serverSideStorage = "../data/db.json";

fs.readFile(serverSideStorage, function(err, buf) {
    if(err) {
        console.log("error: ", err);
    } else {
        data = JSON.parse(buf.toString());
        if(data.length != 0) {
            counter = data[data.length-1];
        }
    }
    console.log("data read from file gamer.");
});

function saveToServer(data) {
    fs.writeFile(serverSideStorage, JSON.stringify(data), function(err, buf) {
        if(err) {
            console.log("error: ", err);
        } else {
            console.log("data saved successfully gamer.");;
        }
    })
}


app.use('/static', express.static("Public"));



var bodyParser = require("body-parser");
const { count } = require('console');
app.use('/api/', bodyParser.urlencoded({extended: true}));
app.use('/api/', bodyParser.json());


app.listen(3000);