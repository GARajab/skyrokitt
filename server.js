const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const session = require("express-session");
const isSignedIn = require("./middleware/is-sign-in");
const passUserToView = require("./middleware/pass-user-to-view");
const mongoose = require("mongoose");
const methodOverRide = require("method-override");
const port = process.env.PORT ? process.env.PORT : 3000;
const path = require("path");
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(
    `Database is connected its name is : ${mongoose.connection.name}`
  );
});
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverRide("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView);
// landing page
app.get("/", async (req, res) => {
  // res.render("index.ejs");
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/applications`);
  } else {
    res.render("index.ejs");
  }
});

app.get("/vip-lounge", isSignedIn, (req, res) => {
  res.send(`Welcome to the party ${req.session.user.username}`);
});

// require("controller")
const authController = require("./controllers/auth");
const applicationsController = require("./controllers/applications");

app.use("/auth", authController);
app.use(isSignedIn);
app.use("/users/:userId/applications", applicationsController);
app.listen(port, () => {
  console.log(`Server is running using port: ${port}`);
});

app.use((req, res, next) => {
  if (req.session.messages) {
    res.locals.messages = req.session.messages;
    req.session.messages = null;
  } else {
    res.locals.messages = null;
  }
  next();
});
