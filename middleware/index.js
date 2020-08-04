var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be login to do that!");
    res.redirect("/login");
}

middlewareObj.checkRestaurantOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Restaurant.findById(req.params.id, function(err, found) {
            if (err || !found) {
                req.flash("error", "Restaurant not found!");
                res.redirect("back");
            } else {
                if(found.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be login to do that!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, found) {
            if (err || !found) {
                req.flash("error", "Something went wrong");
                res.redirect("back");
            } else {
                if(found.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be login to do that!");
        res.redirect("back");
    }
}

module.exports = middlewareObj;