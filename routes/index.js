const express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


// ROOT route
router.get("/", function(req, res) {
    res.render("landing");
  });
  
  // register
  router.get("/register", function(req, res) {
    res.render("register");
  });
  
  router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
      if (err) {
        return res.render("register", {"error": err.message});
      }
      passport.authenticate("local")(req, res, function() {
        req.flash("success", "Welcome to ResTour " + user.username);
        res.redirect("/restaurants");
      });
    });
  });
  
  // Login
  router.get("/login", function(req, res) {
    res.render("login");
  });
  
  router.post("/login", passport.authenticate("local",
    {
      successRedirect: "/restaurants",
      failureRedirect: "/login"
    }), function(req, res) {
  });
  
  //LOGOUT
  router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/restaurants");
  });
  
  module.exports = router;