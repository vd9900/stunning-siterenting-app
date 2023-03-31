const path = require("path");
const bcrypt = require("bcrypt");

const { UserDetail } = require("../Schemas/schema");

// GET Method
function loginGET(req, res) {
  try {
    if (req.session.isAuth) {
      res.redirect("/home");
    } else {
      res.sendFile(path.join(__dirname, "../views/index.html"));
    }
  } catch {
    res.send("Something went wrong Try again later");
  }
}

// POST Method

async function loginPOST(req, res) {
  console.log(req.body);

  try {
    const result = await UserDetail.findOne({ email: req.body.email }, {});

    if (result) {
      const match = await bcrypt.compare(req.body.password, result.password);
      if (match) {
        //adding session
        req.session.isAuth = true;
        req.session.username = result.name;
        req.session.email = result.email;
        req.session.save();
        res.redirect("/home");
      } else {
        res.send(
          `<h2>🤨 wrong password try again <a href="${process.env.SERVER_URL}/login">login</a></h2>`
        );
      }
    } else {
      res.send(
        `<h2>😭 User not founded! try again <a href="${process.env.SERVER_URL}/login">login</a></h2>`
      );
    }
  } catch {
    res.send("Something went wrong Try again later");
  }
}

module.exports = { loginGET, loginPOST };
