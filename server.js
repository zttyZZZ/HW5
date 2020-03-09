const express = require("express");
const path = require("path");
const fs = require("fs");
const Datastore = require("nedb");

const db = new Datastore({ filename: "toppings.db", autoload: true });

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views/about.html"));
});

function getToppings(cb) {
  db.find({}, (err, toppings) => {
    cb(err, toppings);
  });
}

function addTopping(topping, cb) {
  db.insert({name: topping}, (err, newTopping) => {
    cb(err, newTopping);
  });
}

function deleteTopping(toppingToDelete, cb) {
  db.remove({name: toppingToDelete}, (err, numRemoved) => {
    cb(err, numRemoved);
  });
}

app.get("/toppings", (req, res) => {
  getToppings((err, toppings) => {
    res.json(toppings);
  });
});

app.post("/toppings", (req, res) => {
  const topping = req.body.topping;
  addTopping(topping, (err, newTopping) => {
    res.json(newTopping);
  });
});

app.delete("/toppings/:name", (req, res) => {
  const toppingToDelete = req.params.name;
  deleteTopping(toppingToDelete, (err, numDeleted) => {
    res.json({ numDeleted: numDeleted });
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000!");
});