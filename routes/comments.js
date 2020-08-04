const express = require('express');
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
var middleware = require("../middleware"); // automatically requires contents of index.js inside middleware directory

// New Comments
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Restaurant.findById(req.params.id, function(err, found) {
      if (err) {
        console.log(err);
      } else {
        res.render("comments/new", {restaurant: found});
      }
    });
  });
  
  // Create comment
  router.post("/", middleware.isLoggedIn, function(req, res) {
    Restaurant.findById(req.params.id, function(err, found) {
      if (err) {
        console.log(err);
        res.redirect("/restaurants");
      } else {
        Comment.create(req.body.comment, function(err, createdComment) {
          if (err) {
            req.flash("error", "Something went wrong");
            console.log(err);
          } else {
            createdComment.author.id = req.user._id;
            createdComment.author.username = req.user.username;
            createdComment.save();
            found.comments.push(createdComment);
            found.save();
            req.flash("success", "Comment added successfully");
            res.redirect("/restaurants/" + found._id);
          }
        });
      }
    });
  });

  // Edit comment
  router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, found) {
      if (err) {
        res.redirect("back");
      } else {
        res. render("comments/edit", {
          restaurant_id: req.params.id,
          comment: found
        });
      }
    });
  });
  // Update comment
  router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updated) {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect("/restaurants/" + req.params.id); 
      }
    });
  });
  // Destroy comment
  router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
      if(err) {
        res.redirect("back");
      } else {
        req.flash("success", "Comment deleted successfully");
        res.redirect("/restaurants/" + req.params.id);
      }
    });
  });
 
  module.exports = router;