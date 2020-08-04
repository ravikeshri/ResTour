const express = require('express');
var router = express.Router();
var Restaurant = require("../models/restaurant");
var middleware = require("../middleware"); // automatically requires contents of index.js inside middleware directory

// INDEX route
router.get("/", function(req, res) {
    // Fetch data from db
    Restaurant.find({}, function(err, restaurants){
      if(err) {
        console.log(err);
      } else {
        res.render("restaurants/index", {restaurants: restaurants});
      }
    });
  });
  
  
  // CREATE route
  router.post("/", middleware.isLoggedIn, function(req, res) {
    // Fetch data from html form
    var name = req.body.name,
        image = req.body.image,
        description = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    }
    var newRest = {name: name, image: image, description: description, author: author};
    // Add to db
    Restaurant.create(newRest, function(err, created) {
      if(err) {
        console.log(err);
      } else {
        res.redirect("/restaurants");
      }
    });
  });
  
  // NEW route
  router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("restaurants/new");
  });
  
  // SHOW route
  router.get("/:id", function(req, res) {
    // Show data of restaurant with given id
    Restaurant.findById(req.params.id).populate("comments").exec(function(err, searchResult) {
      if (err || !searchResult) {
        console.log(err);
        req.flash('error', 'Sorry, that restaurant does not exist!');
        return res.redirect('/restaurants');
      } else {
        res.render("restaurants/show", {restaurant: searchResult});
      }
    });
  });

  // edit 
  router.get("/:id/edit", middleware.checkRestaurantOwnership, function(req, res) {
      Restaurant.findById(req.params.id, function(err, found) {
        res.render("restaurants/edit", {restaurant: found});
      });
  });
  // update
  router.put("/:id", middleware.checkRestaurantOwnership, function(req, res) {
      Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updated) {
          if(err) {
              res.redirect("/restaurants");
          } else {
              res.redirect("/restaurants/" + req.params.id);
          }
      });
  });

  // Destroy
  router.delete("/:id", middleware.checkRestaurantOwnership, function(req, res) {
    Restaurant.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/restaurants");
        } else {
            res.redirect("/restaurants");
        }
    });
  });

  module.exports = router;