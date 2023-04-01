const path = require("path");

// GET method
function logoutGET(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.send(
        "<h2>😭 Something went wrong Try again later <a href='/login'>Try Again</a> </h2>"
      );
    } else {
      res.redirect("/login");
    }
  });
}
module.exports = { logoutGET };
