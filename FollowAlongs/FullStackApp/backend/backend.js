var express = require('express');
var app = express();
var cors = require('cors');

app.use(cors());

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





var bodyParser = require("body-parser");
const { count } = require('console');
app.use('/api/', bodyParser.urlencoded({extended: true}));
app.use('/api/', bodyParser.json());

//READ ALL
app.get("/api/", function (req, res) {
    res.send(data);
    res.end(); 
});

//CREATE
app.post("/api/", function (req, res) {
    let name = req.body.name;
    let counter = req.body.count;
    data.push(  {"name": name, "count": counter });
    saveToServer(data);
    res.send("POST Successful gamer.");
    res.end(); 
});

//READ ONE
app.get("/api/id/:id", function (req, res) {
    let id = parseInt(req.params.id);
    let result = data[id];
    res.send(result);
    res.end(); 
}).put("/api/id/:id", function (req, res) {
    let id = parseInt(req.params.id);
    let name = req.body.name;
    let counter = req.body.count;
    data[id] =   {"name": name, "count": counter };
    saveToServer(data);
    res.send("PUT Successful gamer.");
    res.end(); 
}).delete("/api/id/:id", function (req, res) {
    let id = parseInt(req.params.id);
    data.splice(id, 1);
    saveToServer(data);
    res.send("DELETE successful gamer.");
    res.end(); 
});

app.listen(3000);