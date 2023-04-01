const path = require("path");
const express = require("express");
const Router = express.Router();
const fs = require("fs");


// res.sendFile(path.join(__dirname, "../views/product.html"))
Router.get("/", function propertyGET(req, res) {
  if (req.session.isAuth) {
    req.session.clickedpro = req.query.id;
    const serverUrl = process.env.SERVER_URL;
    const html = fs.readFileSync(
      path.join(__dirname, "../views/product.html"),
      "utf8"
    );
    const modifiedHtml = html.replace("__SERVER_URL__", serverUrl);
    res.send(modifiedHtml);
    // console.log(req.cookies)
  } else {
    res.redirect("/login");
  }
});

module.exports = Router;
