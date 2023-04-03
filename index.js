const express = require("express");
const bodyParser = require("body-parser");
const moongose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
var session = require("express-session");
const env = require("dotenv");
var cookieParser = require("cookie-parser");
const { default: mongoose } = require("mongoose");
const fileUpload = require("express-fileupload");
const app = express();
const appRouter = express.Router();

env.config({ path: "./config.env" });
require("dotenv").config();
//session

app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
const port = process.env.PORT || 5000;
app.set("trust proxy", 1); // trust first proxy)
app.use(
  session({
    secret: "1234676890dsafs",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(`views`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", appRouter);

const { signinPOST } = require("./contorller/signin");
const { loginGET, loginPOST } = require("./contorller/login");
const { homeGET } = require("./contorller/home");
const { bookingconfGET, bookingconfPOST } = require("./contorller/bookingconf");
const { bookingconformedGET } = require("./contorller/bookingconformed");
const { mybookingsGET } = require("./contorller/mybooking");
const { mybookingsdetailsGET } = require("./contorller/mybookingdetails");
const { helpGET } = require("./contorller/help");
const { logoutGET } = require("./contorller/logout");
const {
  UserDetail,
  HostedRoomDetails,
  BookedroomDetails,
  ReviewDetails,
} = require("./Schemas/schema");

const ratingRoute = require("./contorller/rating");
const propertyRoute = require("./contorller/property");
const hosterRoute = require("./contorller/hoster");
const { nextTick } = require("process");

// image storing path
const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./views/assets");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(
      null,
      Date.now() +
        path.parse(file.originalname).name +
        path.extname(file.originalname)
    );
  },
});

// multer docs
const gallery = multer({ storage: galleryStorage }).array("Gallery");

const DB = "mongodb://127.0.0.1:27017/Rent-App";

mongoose
  .connect(process.env.DATABASE_URL)
  .then((res) => console.log("Sever connected to Database"))
  .catch((err) => console.log(err));

// Login page
appRouter.route("/login").get(loginGET).post(loginPOST);

// SignUp page
appRouter.route("/signin").post(signinPOST);

// logout page

appRouter.route("/logout").get(logoutGET);

// home page
appRouter.route("/home").get(homeGET);

//Hoster page
appRouter.use("/hoster", hosterRoute);

//Product page
appRouter.use("/property", propertyRoute);

// my booking conformation  page
appRouter
  .route("/property/bookingconf")
  .get(bookingconfGET)
  .post(bookingconfPOST);

// my booking conformed  page
appRouter.route("/conformed").get(bookingconformedGET);

// my booking  page
appRouter.route("/mybookings").get(mybookingsGET);

// my booking details  page
appRouter.route("/mybooking").get(mybookingsdetailsGET);

// rating and reivews page
appRouter.use("/rating", ratingRoute);

//contact page
appRouter.route("/help").get(helpGET);

// properity page showing to user

appRouter.get("/fetchproperty", async (req, res) => {
  const result = await HostedRoomDetails.findOne(
    { propertyId: req.session.clickedpro },
    {}
  );
  res.json(result);
});

// fecthing data to front-end
app.get("/fetchproperties", async (req, res) => {
  const result = await HostedRoomDetails.find({}, {});
  console.log(result);
  res.json(result);
});

app.get("/fetchbookedRoom", async (req, res) => {
  console.log(req.session);
  const result = await HostedRoomDetails.findOne(
    { propertyId: req.session.clickedpro },
    {}
  );
  console.log(result);
  (req.session.bookedRoom.roomDetails = {
    propertyName: result.propertyName,
    propertyId: req.session.clickedpro,
    mainTitle: result.mainTitle,
    city: result.address.city,
    country: result.address.country,
    updated: result.updated,
  }),
    // calculating the total amount
    (req.session.bookedRoom.totalPrice =
      result.price * req.session.bookedRoom.Non);

  console.log(req.session.bookedRoom);
  res.send(req.session.bookedRoom);
});
//  creating api for my booking properties

app.get("/fetchmybookedrooms", async (req, res) => {
  const result = await BookedroomDetails.find(
    { whoBooked: req.session.email },
    {}
  );
  res.json(result);
});

app.get("/fetchmybookedroom", async (req, res) => {
  const id = req.session.clickedbookedroomId;
  const result = await BookedroomDetails.find({ _id: id }, {});
  res.json(result);
});

app.get("/fetchreivewproduct", async (req, res) => {
  const result = await ReviewDetails.find(
    { propertyId: req.session.clickedpro },
    {}
  );
  res.json(result);
});

app.listen(port);
