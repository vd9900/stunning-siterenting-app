const path = require("path");
const fs = require("fs");


function mybookingsGET(req, res) {
  //   res.sendFile(path.join(__dirname, "../views/mybookings.html"));
  if (req.session.isAuth) {
    const serverUrl = process.env.SERVER_URL;
    const html = fs.readFileSync(
      path.join(__dirname, "../views/mybookings.html"),
      "utf8"
    );
    const modifiedHtml = html.replace("__SERVER_URL__", serverUrl);
    res.send(modifiedHtml);
  } else {
    res.redirect("/login");
  }
}

module.exports = { mybookingsGET };
