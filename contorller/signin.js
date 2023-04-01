const bcrypt = require("bcrypt")
const { UserDetail } = require("../Schemas/schema")

// post method
function signinPOST(req, res) {
  console.log(req.body)
  // hashing the password
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(req.body.password, salt)
  console.log(hash)
  const NewUserDetail = new UserDetail({
    name: req.body.name,
    userId: req.body.userId,
    email: req.body.email,
    phone: req.body.phone,
    password: hash,
    userType: req.body.userType,
  })
  NewUserDetail.save((err, docs) => {
    if (err) {
      console.log(err)
      res.send("<h2>😭 Something went wrong Try again later <a href='/login'>Try Again</a> </h2>")
    } else {
      res.redirect("/login")
    }

  })
}





module.exports = { signinPOST }
