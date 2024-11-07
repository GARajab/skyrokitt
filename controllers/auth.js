const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (userInDatabase) {
    return res.send("Username already in database");
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.send("Passwords do not match");
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;
  const user = await User.create(req.body);
  res.send(`Thanks for signing up ${user.username}`);
});

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

router.post("/sign-in", async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send("Login Failed Pleas Try Again");
    }
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );
    if (!validPassword) {
      return res.send("Login Failed. Please try again.");
    }
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
    };
    req.session.messages = "You Logged In Successfully";
    res.redirect("/");
  } catch (err) {
    console.log(err);
    req.session.messages = "Please try again later";
  }
});

router.get("/sign-out", (req, res) => {
  req.session.destroy();
  // res.send("Logged Out Successfully");
  res.redirect("/");
});

module.exports = router;
