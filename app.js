const express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      passport   = require('passport'),
      flash      = require('connect-flash'),
      LocalStrategy = require('passport-local'),
      methodOverride = require('method-override'),
      User = require("./models/user"),
      seedDB     = require('./seeds');

const commentRoutes    = require('./routes/comments'),
      restaurantRoutes = require('./routes/restaurants'),
      indexRoutes      = require('./routes/index');

// Connect to mongoDB
mongoose.connect("mongodb://localhost/rest_app", {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useFindAndModify: false
});

app.use(bodyParser.urlencoded({extended: true}));
// Set view engine
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Seed the database
// seedDB();

// Passport setup
app.use(require("express-session")({
  secret: "ResTour app is fun!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Current user
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/restaurants/:id/comments", commentRoutes);


// Connect to the server
app.listen(3000, function() {
  console.log("Server Started!!");
});
