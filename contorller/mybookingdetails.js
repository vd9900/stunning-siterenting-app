const path = require("path");
const fs = require("fs");


function mybookingsdetailsGET(req, res) {
  if (req.session.isAuth) {
    req.session.clickedbookedroomId = req.query.id;
    const serverUrl = process.env.SERVER_URL;
    const html = fs.readFileSync(
      path.join(__dirname, "../views/bookingdeatils.html"),
      "utf8"
    );
    const modifiedHtml = html.replace("__SERVER_URL__", serverUrl);
    res.send(modifiedHtml);
    // res.sendFile(path.join(__dirname, "../views/bookingdeatils.html"))
  } else {
    res.redirect("/login");
  }
}
module.exports = { mybookingsdetailsGET };
