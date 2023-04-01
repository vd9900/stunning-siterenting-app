const path = require("path");
const fs = require("fs");
const serverUrl = process.env.SERVER_URL;

function bookingconfGET(req, res) {
  if (req.session.isAuth) {
    const html = fs.readFileSync(
      path.join(__dirname, "../views/bookingconf.html"),
      "utf8"
    );
    const modifiedHtml = html.replace("__SERVER_URL__", serverUrl);
    res.send(modifiedHtml);
  } else {
    res.redirect("/login");
  }
}
function bookingconfPOST(req, res) {
  console.log(req.body);
  if (req.session.bookedRoom) {
    delete req.session.bookedRoom;
  }
  req.session.bookedRoom = req.body;
  const html = fs.readFileSync(
    path.join(__dirname, "../views/bookingconf.html"),
    "utf8"
  );
  const modifiedHtml = html.replace("__SERVER_URL__", serverUrl);
  res.send(modifiedHtml);

  //   res.sendFile(path.join(__dirname, "../views/bookingconf.html"));
}

module.exports = { bookingconfGET, bookingconfPOST };
