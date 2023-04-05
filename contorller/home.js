const path = require("path");
const fs = require("fs");
// res.sendFile();
function homeGET(req, res) {
  if (req.session.isAuth) {
    const serverUrl = process.env.SERVER_URL;
    console.log(serverUrl);
    const html = fs.readFileSync(
      path.join(__dirname, "../views/home.html"),
      "utf8"
    );
    const modifiedHtml = html.replace("__SERVER_URL__", serverUrl);
    res.send(modifiedHtml);
  } else {
    res.redirect("/login");
  }
}

module.exports = { homeGET };
