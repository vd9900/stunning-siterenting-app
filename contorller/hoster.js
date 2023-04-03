const express = require("express");
var session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const { HostedRoomDetails } = require("../Schemas/schema");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dtsxq1mlu",
  api_key: "567644344666746",
  api_secret: "W0wiwCrwT9KxRvuDEbsTrbsaGss",
});

const app = express();
const Router = express.Router();

const cloudinaryImageUploadMethod = async (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(file, { folder: "upload" }, (err, res) => {
      if (err) return res.status(500).send("upload image error");
      resolve({
        res: res.secure_url,
      });
    });
  });
};
//session
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "1234676890dsafs",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// image storing path
const storage = multer.memoryStorage();
const gallery = multer({ storage: storage }).array("files", 5);

Router.get("/", (req, res) => {
  if (req.session.isAuth) {
    res.sendFile(path.join(__dirname, "../views/hoster.html"));
  } else {
    res.redirect("/login");
  }
  console.log(req.session.isAuth);
});

Router.post("/", async (req, res) => {
  // console.log(req.body);
  let properityId = 0;
  if ((await HostedRoomDetails.count({})) == 0) {
    properityId = 1;
  } else {
    let newPropertiyId = await HostedRoomDetails.findOne().sort("-_id");
    properityId = newPropertiyId.propertyId + 1;
  }

  // push images one by one into array
  console.log(req.files);
  const urls = [];
  const files = req.files;
  for (let i = 0; i < files.length; i++) {
    const { tempFilePath } = files[i];
    const newPath = await cloudinaryImageUploadMethod(tempFilePath);
    urls.push(newPath);
  }
  // const imageData = await Promise.all(
  //   req.files.map(async (file) => {
  //     const result = await cloudinary.uploader.upload(file.buffer, {
  //       folder: "your_folder_name",
  //       use_filename: true,
  //     });
  //     return result.secure_url;
  //   })
  // );
  // console.log(imageData);
  // console.log(properityId);
  // console.log(req.session);

  const newHostedRoomDetails = new HostedRoomDetails({
    propertyId: properityId,
    owner: req.session.username,
    propertyName: req.body.propertyName,
    address: {
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
    },
    price: req.body.price,
    size: req.body.size,
    roomImage: [],
    total: {
      Bedrooms: req.body.totalBedrooms,
      Beds: req.body.totalBeds,
      Bathrooms: req.body.totalBathrooms,
      Allowedpeople: req.body.totalGuest,
    },
    mainTitle: req.body.mainTitle,
    roomDescription: req.body.description,
    amenities: {
      indoor: req.body.indoor,
      outdoor: req.body.outdoor,
      essentials: req.body.essentials,
    },
  });

  newHostedRoomDetails.save((err) => {
    if (err) {
      res.send(
        `Something went Wrong try again😭 <a href="/home">back to home</a>`
      );
    } else {
      res.send(
        `<h2>Your post successfully added😊 <a href="/home">back to home</a><h2>`
      );
    }
  });
});

module.exports = Router;
