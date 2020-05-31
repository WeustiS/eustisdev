const functions = require("firebase-functions");
const express = require("express");

const app = express();
app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  res.render("demo");
});

exports.app = functions.https.onRequest(app);
